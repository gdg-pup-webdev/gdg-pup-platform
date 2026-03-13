# GDG PUP Platform — CI/CD Overview

This directory contains all GitHub Actions configuration for the GDG PUP Platform monorepo.

---

## Directory Structure

```
.github/
├── workflows/              # Orchestration — triggers and job wiring only
│   ├── test.yml            # CI: runs on push/PR, gates the pipeline
│   ├── detect-changes.yml  # Shared: resolves environment + which services changed
│   ├── docker-build-push.yml  # Builds and pushes Docker images (selective)
│   └── deploy.yml          # Deploys changed services to Cloud Run
│
├── tests/
│   └── action.yml          # Composite: Node 20 setup, pnpm cache, build, test
│
├── builds/
│   └── action.yml          # Composite: Docker login, buildx, build, push
│
├── deployments/
│   └── action.yml          # Composite: GCP auth, gcloud run deploy, health check
│
├── cicd-plan.md            # Full technical planning document
├── ci.md                   # Original pipeline spec
└── README.md               # This file
```

---

## Pipeline Flow

```
Push / PR
   │
   ▼
[test.yml] ──────────────── calls ──▶ tests/action.yml
   │ (must pass)
   ▼
[docker-build-push.yml] ─── calls ──▶ detect-changes.yml  (which services changed?)
   │                              ──▶ builds/action.yml     (per changed service)
   │ (images pushed to Docker Hub)
   ▼
[deploy.yml] ──────────────  calls ──▶ detect-changes.yml  (same check)
                                   ──▶ deployments/action.yml (per changed service)
```

### Branch → Environment

| Branch | Environment | Domains |
|---|---|---|
| `deploy-develop` | `dev` | `dev.gdgpup.org`, `api.dev.gdgpup.org`, `identity.dev.gdgpup.org` |
| `staging` | `staging` | `staging.gdgpup.org`, `api.staging.gdgpup.org`, `identity.staging.gdgpup.org` |
| `main` | `prod` | `gdgpup.org`, `api.gdgpup.org`, `identity.gdgpup.org` |

---

## Selective Builds

Only services **whose files changed** are built and deployed. This is handled by `detect-changes.yml` using `dorny/paths-filter`.

| Service | Triggers on changes to |
|---|---|
| `nexus-web` | `apps/nexus-web/**`, `packages/**`, `docker-compose*.yml` |
| `nexus-api` | `apps/nexus-api/**`, `packages/**`, `docker-compose*.yml` |
| `identity-api` | `apps/identity-api/**`, `packages/**`, `docker-compose*.yml` |

> Changes to `packages/**` trigger all services since shared package updates can affect any service.

---

## Composite Actions

Each directory contains a single `action.yml` that encapsulates one concern:

### `tests/action.yml`
Sets up Node 20, restores pnpm cache, installs dependencies, runs `turbo build` and `turbo test`.

### `builds/action.yml`
Accepts `service`, `environment`, `dockerfile`, Docker Hub credentials, and optional `build-args`. Logs in to Docker Hub, sets up Docker Buildx with GHA layer caching (scoped per service+environment), builds and pushes the image.

**Image tag format:** `gdgpup/gdg-pup-platform-<service>:<environment>`

### `deployments/action.yml`
Accepts `service`, `environment`, GCP credentials, and a `health-check-url`. Authenticates with GCP using a service account JSON key, runs `gcloud run deploy` to update the Cloud Run service image, then verifies the deployment via a health check curl.

**Cloud Run service name format:** `<service>-<environment>` (e.g. `nexus-api-prod`)

---

## Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (not password) |
| `GCP_SA_KEY` | GCP service account JSON key (raw JSON) |
| `GCP_PROJECT_ID` | `gdgpup-484914` |

### GCP Service Account Permissions

The service account used for `GCP_SA_KEY` needs:
- `roles/run.admin` — to deploy new Cloud Run revisions
- `roles/iam.serviceAccountUser` — to act as the Cloud Run runtime SA

---

## Deployment Strategy

The pipeline uses `gcloud run deploy` (not Terraform) to update running services. Terraform is reserved for infrastructure changes (new services, domain mappings, IAM). This keeps deployments fast (~10s vs ~60s for Terraform).

Cloud Run keeps previous revisions available. To roll back manually:
```bash
gcloud run services update-traffic <service>-<env> \
  --to-revisions=<previous-revision>=100 \
  --region=asia-southeast1
```

---

## Adding a New Service

1. Add a new `build-<service>` job in `docker-build-push.yml`
2. Add a new `deploy-<service>` job in `deploy.yml`
3. Add the service path filter to `detect-changes.yml`
4. Add the Cloud Run service + domain to `terraform.*.tfvars` (infrastructure change)
