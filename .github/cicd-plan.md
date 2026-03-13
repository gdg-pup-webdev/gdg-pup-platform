# CI/CD Pipeline — Technical Plan

**Project:** GDG PUP Platform  
**Date:** March 1, 2026  
**Status:** Pending Review  

---

## 1. Overview

This document outlines the CI/CD pipeline for the GDG PUP Platform monorepo. The pipeline automates testing, Docker image builds, and deployment to Google Cloud Run across three environments.

### System Context

| Component | Technology |
|---|---|
| Monorepo | pnpm + Turborepo |
| Services | `nexus-web` (Next.js), `nexus-api` (Express), `identity-api` (Express) |
| Registry | Docker Hub (`gdgpup/`) |
| Hosting | Google Cloud Run (asia-southeast1) |
| DNS | Cloudflare → `gdgpup.org` |
| CI/CD | GitHub Actions |

### Environment Matrix

| Service | Dev | Staging | Production |
|---|---|---|---|
| nexus-web | `dev.gdgpup.org` | `staging.gdgpup.org` | `gdgpup.org` |
| nexus-api | `api.dev.gdgpup.org` | `api.staging.gdgpup.org` | `api.gdgpup.org` |
| identity-api | `identity.dev.gdgpup.org` | `identity.staging.gdgpup.org` | `identity.gdgpup.org` |

---

## 2. Pipeline Architecture

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Git Push /  │────▶│  Test Workflow        │────▶│  Docker Build &  │
│  Pull Request│     │  (build + test)       │     │  Push (selective)│
└──────────────┘     └──────────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  Deploy Workflow  │
                                                  │  (gcloud run)    │
                                                  └──────────────────┘
```

### Branch-to-Environment Mapping

| Branch | Environment | Trigger |
|---|---|---|
| `deploy-develop` | dev | Automatic on push |
| `staging` | staging | Automatic on push |
| `main` | prod | Automatic on push |

> **Note:** The `dev` branch is reserved for local testing. CI/CD deploys are triggered by `deploy-develop`.

---

## 3. Workflow Details

### 3.1 Test Workflow (`test.yml`)

> **Current Status:** Temporarily disabled (commented out in `.github/workflows/ci.test.yml`) and delegated to the other DevOps engineer.

**Trigger:** Every push and PR to `deploy-develop`, `staging`, `main`

| Step | Command | Purpose |
|---|---|---|
| Setup | Node 20, pnpm (cached) | Environment preparation |
| Install | `pnpm install --frozen-lockfile` | Dependency installation |
| Build | `pnpm turbo run build` | Compile all packages and apps |
| Test | `pnpm turbo run test` | Run vitest suites |

The reusable setup and test logic lives in `.github/tests/action.yml` (composite action) so it can be shared across workflows.

- Uses `actions/cache` for pnpm store to speed up installs.
- Concurrency group cancels in-progress runs on the same branch.
- Must pass before any Docker images are built.

### 3.2 Docker Build & Push Workflow (`docker-build-push.yml`)

> **Current Status:** Temporarily disabled (commented out in `.github/workflows/ci.docker-build-push.yml`) and delegated to the other DevOps engineer for selective builds and Docker repository push/pull flow.

**Trigger:** Runs after Test workflow succeeds (via `workflow_run`)

#### Selective Builds

Uses `dorny/paths-filter` to detect which services changed. Only changed services are built and pushed, reducing build time and registry writes.

| Service | Triggers on changes to |
|---|---|
| nexus-web | `apps/nexus-web/**`, `packages/**`, `docker-compose*.yml` |
| nexus-api | `apps/nexus-api/**`, `packages/**`, `docker-compose*.yml` |
| identity-api | `apps/identity-api/**`, `packages/**`, `docker-compose*.yml` |

> Shared packages (`packages/**`) trigger all service builds because API contract changes can affect any service.

#### Image Tagging

Images are tagged by environment, matching the tags referenced in Terraform tfvars:

```
gdgpup/gdg-pup-platform-<service>:<environment>
```

Examples:
- `gdgpup/gdg-pup-platform-nexus-web:dev`
- `gdgpup/gdg-pup-platform-nexus-api:staging`
- `gdgpup/gdg-pup-platform-identity-api:prod`

The per-service build logic lives in `.github/builds/action.yml` (composite action) to keep the workflow file clean and DRY. It accepts `service`, `environment`, and optional build args as inputs.

#### Build Args (nexus-web only)

The Next.js frontend bakes API URLs at build time. The workflow injects the correct `NEXT_PUBLIC_*` values per environment:

| Environment | `NEXT_PUBLIC_NEXUS_API_URL` | `NEXT_PUBLIC_IDENTITY_API_URL` |
|---|---|---|
| dev | `https://api.dev.gdgpup.org` | `https://identity.dev.gdgpup.org` |
| staging | `https://api.staging.gdgpup.org` | `https://identity.staging.gdgpup.org` |
| prod | `https://api.gdgpup.org` | `https://identity.gdgpup.org` |

#### Caching

Uses GitHub Actions cache (`cache-from: type=gha`) for Docker layer caching. Multi-stage Dockerfiles benefit significantly — the `pruner` and `installer` stages are cached between runs.

### 3.3 Deploy Workflow (`deploy.yml`)

**Trigger:** Runs after Docker Build & Push succeeds (via `workflow_run`). Automatic for all environments including prod.

#### Deployment Strategy

Uses `gcloud run deploy` instead of Terraform because:
1. Cloud Run infrastructure (services, IAM, domain mappings) is already provisioned via Terraform
2. The pipeline only needs to update the container image, not recreate resources
3. `gcloud run deploy` is faster (~10s vs ~60s for Terraform init + plan + apply)
4. Terraform is reserved for infrastructure changes, done manually or via a separate workflow

#### Deploy Steps

The deploy logic lives in `.github/deployments/action.yml` (composite action). For each changed service:
1. Authenticate with GCP using service account JSON key
2. Run `gcloud run deploy <service>-<env> --image <new-image> --region asia-southeast1`
3. Cloud Run creates a new revision and routes 100% traffic to it
4. Health check: `curl https://<domain>/api/health`

#### Rollback

If a deployment fails or health checks don't pass:
- Cloud Run keeps the previous revision active
- Rollback via: `gcloud run services update-traffic <service> --to-revisions=<previous>=100`

---

## 4. Secrets & Credentials

The following GitHub Actions secrets must be configured in the repository settings:

| Secret Name | Description | Where Used |
|---|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username | Docker Build & Push |
| `DOCKERHUB_TOKEN` | Docker Hub access token | Docker Build & Push |
| `GCP_SA_KEY` | GCP service account JSON key | Deploy |
| `GCP_PROJECT_ID` | `gdgpup-484914` | Deploy |

### Service Account Permissions

The GCP service account used for deployments needs these roles:
- `roles/run.admin` — Deploy new revisions to Cloud Run
- `roles/iam.serviceAccountUser` — Act as the Cloud Run runtime service account

---

## 5. File Structure

```
.github/
├── workflows/
│   ├── auto.auto-label.yml            # Automation: labels PRs
│   ├── auto.close-issue-on-dev.yml    # Automation: closes issues on dev branch
│   ├── auto.scrape-events.yml         # Automation: scrapes events
│   ├── auto.thank-contributors.yml    # Automation: thanks contributors
│   ├── auto.welcome-contributors.yml  # Automation: welcomes new contributors
│   ├── ci.test.yml                    # CI: triggers on push/PR
│   ├── ci.detect-changes.yml          # CI: shared change detection (reusable)
│   ├── ci.docker-build-push.yml       # CI: build & push, triggers after test
│   └── ci.deploy.yml                  # CI: deploy, triggers after build
├── tests/
│   └── action.yml                     # Composite: Node + pnpm setup, build, test
├── builds/
│   └── action.yml                     # Composite: Docker login, build, push
└── deployments/
    └── action.yml                     # Composite: GCP auth, gcloud run deploy, health check
```

**Why this structure?**
- **Workflow files** stay thin — they define triggers, detect changes, and call composite actions
- **Composite actions** contain the reusable logic — setup, build, deploy steps
- Adding a new service only requires adding a new job that calls the same composite action with different inputs
- Easy to test and iterate on individual pipeline stages independently

---

## 6. Task Split

### 🎯 Lead DevOps — You (Critical, do these first)

| Task | Reason | Status |
|---|---|---|
| Set up GitHub Secrets (`GCP_SA_KEY`, `GCP_PROJECT_ID`, `DOCKERHUB_*`) | Requires access to GCP console and Docker Hub | ⏳ Pending |
| Create GCP Service Account with `run.admin` + `iam.serviceAccountUser` roles | Touches production IAM | ⏳ Pending |
| Write `ci.deploy.yml` + `.github/deployments/action.yml` | Touches live Cloud Run services, needs env URL knowledge | ✅ Done |

### 🤝 Other DevOps — Delegate

| Task | Reason | Status |
|---|---|---|
| Re-enable and validate `ci.test.yml` + `.github/tests/action.yml` | Standard CI, no secrets needed | ⏳ Delegated |
| Re-enable and validate `ci.docker-build-push.yml` + `.github/builds/action.yml` | Owns selective builds and Docker Hub push/pull flow | ⏳ Delegated |

_Both workflow files are currently commented out to keep ownership boundaries clear while deployment/secrets work is completed._

---

## 7. Pipeline Characteristics

| Property | Value |
|---|---|
| **Parallelization** | All 3 service builds run in parallel |
| **Caching** | pnpm store + Docker layer cache (GHA) |
| **Selective builds** | Only changed services are built |
| **Concurrency** | In-progress runs cancelled on same branch |
| **Rollback** | Automatic via Cloud Run revision history |
| **Estimated CI time** | ~2–3 min (test) + ~5–8 min (build) + ~1 min (deploy) |

---

## 8. Before You Push & Trigger the Pipeline (Lead DevOps)

Complete these first under your scope (deployment + secrets/credentials):

- [ ] Create GCP service account for deployment
- [ ] Grant service account roles: `roles/run.admin` and `roles/iam.serviceAccountUser`
- [ ] Export service account JSON key and save as `GCP_SA_KEY` GitHub secret
- [ ] Add `GCP_PROJECT_ID` secret (`gdgpup-484914`)
- [ ] Add Docker Hub secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`) so the delegated Docker workflow can use them once re-enabled
- [ ] Confirm `.github/workflows/ci.deploy.yml` and `.github/deployments/action.yml` are ready on default branch
- [ ] Coordinate with the other DevOps to uncomment and finalize `ci.test.yml` and `ci.docker-build-push.yml`

After the delegated workflows are re-enabled, pushing to `deploy-develop`, `staging`, or `main` can trigger the full pipeline.

## 9. Setup Checklist

Before the pipeline can run, the following must be configured:

- [ ] Create Docker Hub access token and add as `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` secrets
- [ ] Create GCP service account with `run.admin` + `iam.serviceAccountUser` roles
- [ ] Export service account JSON key and add as `GCP_SA_KEY` secret
- [ ] Add `GCP_PROJECT_ID` secret (`gdgpup-484914`)
- [ ] Create `deploy-develop` branch if it doesn't exist
- [ ] Merge all workflow files to `main` (workflows must exist on the default branch)
