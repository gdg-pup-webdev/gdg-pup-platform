# Terraform — GDG PUP Platform Infrastructure

This directory contains all Terraform configurations for provisioning and managing the GDG PUP Platform's cloud infrastructure on **Google Cloud Platform (GCP)**.

---

## Directory Structure

```
terraform/
├── .env                     # Terraform secrets (Cloudflare API token, etc.)
├── terraform.tfvars.example # Example variable values
├── terraform.<env>.tfvars   # Per-environment variable values (not committed)
├── environments/            # Per-environment configurations
│   ├── dev/                 # Development environment
│   │   ├── main.tf          # Core resource definitions (module calls)
│   │   ├── variables.tf     # Input variable declarations
│   │   ├── provider.tf      # GCP + Cloudflare provider configuration
│   │   └── outputs.tf       # Output values for this environment
│   ├── staging/             # Staging environment (same structure)
│   └── prod/                # Production environment (same structure)
├── scripts/
│   ├── create/apply.sh      # Initialize, plan, and apply
│   └── destroy/destroy.sh   # Destroy resources
└── modules/                 # Reusable Terraform modules
    ├── compute/             # Cloud Run services + domain mappings
    ├── data/                # Firestore / Firebase
    ├── dns/                 # Cloudflare DNS records (CNAME → ghs.googlehosted.com)
    └── network/             # VPC, subnets, firewall rules
```

---

## How It Works

### Environments (`environments/`)

Each subdirectory under `environments/` represents a deployment target (dev, staging, prod). Every environment is **self-contained** — it has its own provider config, variables, and state. Environments consume the shared modules to build their infrastructure.

| File               | Purpose                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `main.tf`          | Calls reusable modules from `modules/` and wires them together.          |
| `variables.tf`     | Declares all input variables needed for this environment.                |
| `provider.tf`      | Configures the GCP provider (project, region) and Terraform backend.     |
| `outputs.tf`       | Exposes useful values (IPs, URLs, resource IDs) after `terraform apply`. |
| `terraform.tfvars` | Supplies concrete values for the declared variables (not committed).     |

### Modules (`modules/`)

Modules are **reusable building blocks** that define a logical group of resources. They are called by the environment configs and accept input variables so the same module can be used across dev, staging, and prod with different settings.

| Module    | Responsibility                                                 |
| --------- | -------------------------------------------------------------- |
| `compute` | Cloud Run services, IAM bindings, and **domain mappings**.     |
| `data`    | Firebase / Firestore database provisioning.                    |
| `dns`     | Cloudflare CNAME records pointing custom domains to Cloud Run. |
| `network` | VPC, subnets, firewall rules, Cloud NAT, etc.                  |

Each module follows the standard three-file convention:

| File           | Purpose                                          |
| -------------- | ------------------------------------------------ |
| `main.tf`      | Resource definitions.                            |
| `variables.tf` | Input variables the module accepts.              |
| `outputs.tf`   | Values the module exposes to the calling config. |

---

## Getting Started

### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.0
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install)
- Authenticated GCP account with appropriate project permissions
- Domain verified in [Google Search Console](https://search.google.com/search-console) (for custom domain mappings)
- Cloudflare API token with `Zone:DNS:Edit` permissions

### 1. Authenticate with GCP

```bash
gcloud auth application-default login
```

### 2. Set up secrets

Create `terraform/.env` with your Cloudflare API token (auto-loaded by scripts):

```bash
TF_VAR_cloudflare_api_token=your-cloudflare-api-token
```

> This file is in `.gitignore` and will never be committed.

### 3. Apply infrastructure

Use the helper scripts from the **project root**:

```bash
# Apply a single environment
./terraform/scripts/create/apply.sh dev
./terraform/scripts/create/apply.sh staging
./terraform/scripts/create/apply.sh prod

# Apply all environments
./terraform/scripts/create/apply.sh all

# With flags
./terraform/scripts/create/apply.sh dev --auto-approve --skip-plan
```

### 4. Destroy resources

```bash
./terraform/scripts/destroy/destroy.sh dev
```

---

## Custom Domains

Each Cloud Run service is mapped to a custom subdomain on `gdgpup.org` using **Cloud Run domain mapping** + **Cloudflare DNS**.

### Domain Mapping

| Service      | Dev                       | Staging                       | Prod                  |
| ------------ | ------------------------- | ----------------------------- | --------------------- |
| nexus-web    | `dev.gdgpup.org`          | `staging.gdgpup.org`          | `gdgpup.org`          |
| nexus-api    | `api.dev.gdgpup.org`      | `api.staging.gdgpup.org`      | `api.gdgpup.org`      |
| identity-api | `identity.dev.gdgpup.org` | `identity.staging.gdgpup.org` | `identity.gdgpup.org` |

### How It Works

1. **`dns` module** creates Cloudflare CNAME records pointing each subdomain to `ghs.googlehosted.com`
2. **`compute` module** creates `google_cloud_run_domain_mapping` resources that link each domain to its Cloud Run service
3. **Google automatically provisions SSL certificates** (takes ~10-15 minutes after first apply)

### Configuration

Domains are configured in each environment's `terraform.<env>.tfvars`:

```hcl
# Cloudflare DNS records
domain_mappings = {
  "nexus-web"    = { subdomain = "dev" }
  "nexus-api"    = { subdomain = "api.dev" }
  "identity-api" = { subdomain = "identity.dev" }
}

# Cloud Run domain mapping (inside each service block)
services = {
  "nexus-web" = {
    custom_domain = "dev.gdgpup.org"
    # ... other config
  }
}
```

### Check SSL Status

```bash
make domain-status              # dev (default)
make domain-status ENV=staging
make domain-status ENV=prod
```

All conditions should show `True` when SSL is ready.

### First-Time Setup

Before domain mappings will work, you must **verify domain ownership**:

1. Go to [Google Search Console](https://search.google.com/search-console) → Add `gdgpup.org`
2. Add the TXT verification record in Cloudflare
3. Run `gcloud domains verify gdgpup.org` to associate with your GCP project

---

## Guidelines

1. **Never apply directly to prod** without a reviewed plan. Always run `terraform plan` first and have it reviewed.
2. **Do not hardcode values** in `main.tf` — use variables and `terraform.tfvars` files.
3. **Keep modules generic.** Modules should not reference a specific environment.
4. **State isolation.** Each environment has its own Terraform state. Never share state between environments.
5. **Sensitive values.** Store secrets in `terraform/.env` (auto-loaded by scripts), never in tfvars.

---

## Adding a New Module

1. Create a new directory under `modules/` (e.g., `modules/iam/`).
2. Add `main.tf`, `variables.tf`, and `outputs.tf`.
3. Call the module from the relevant environment's `main.tf`:

```hcl
module "iam" {
  source      = "../../modules/iam"
  project_id  = var.project_id
  environment = var.environment
}
```

4. Run `terraform init` in the environment directory to register the new module.

---

## Adding a New Environment

1. Copy an existing environment directory (e.g., `cp -r environments/dev environments/preview`).
2. Update `provider.tf` with the correct backend bucket and project.
3. Create `terraform.<env>.tfvars` with environment-specific values.
4. Run `terraform init` and `terraform plan`.

---

## Additional Learning Resources

Check out the [official Terraform documentation](https://developer.hashicorp.com/terraform) and Google Skills Boost's [Terraform course](https://www.skills.google/paths/11/course_templates/636).
