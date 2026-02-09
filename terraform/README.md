# Terraform — GDG PUP Platform Infrastructure

This directory contains all Terraform configurations for provisioning and managing the GDG PUP Platform's cloud infrastructure on **Google Cloud Platform (GCP)**.

---

## Directory Structure

```
terraform/
├── terraform.tfvars.example # Example variable values (copy to terraform.tfvars)
├── environments/          # Per-environment configurations
│   ├── dev/               # Development environment
│   │   ├── main.tf        # Core resource definitions (module calls)
│   │   ├── variables.tf   # Input variable declarations
│   │   ├── provider.tf    # GCP provider & backend configuration
│   │   └── outputs.tf     # Output values for this environment
│   ├── staging/           # Staging environment (same structure as dev)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── provider.tf
│   │   └── outputs.tf
│   └── prod/              # Production environment (same structure as dev)
│       ├── main.tf
│       ├── variables.tf
│       ├── provider.tf
│       └── outputs.tf
├── scripts/                # Helper scripts (optional)
│   ├── create/
│   └── destroy/
└── modules/               # Reusable Terraform modules
  ├── network/           # Networking resources (VPC, subnets, firewall rules)
  │   ├── main.tf
  │   ├── variables.tf
  │   └── outputs.tf
  ├── compute/           # Compute resources (Cloud Run, GCE, GKE, etc.)
  │   ├── main.tf
  │   ├── variables.tf
  │   └── outputs.tf
  └── data/              # Data & storage resources (Cloud SQL, GCS, Firestore, etc.)
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

---

## How It Works

### Environments (`environments/`)

Each subdirectory under `environments/` represents a deployment target (dev, staging, prod). Every environment is **self-contained** — it has its own provider config, variables, and state. Environments consume the shared modules to build their infrastructure.

| File            | Purpose                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `main.tf`       | Calls reusable modules from `modules/` and wires them together.         |
| `variables.tf`  | Declares all input variables needed for this environment.               |
| `provider.tf`   | Configures the GCP provider (project, region) and Terraform backend.    |
| `outputs.tf`    | Exposes useful values (IPs, URLs, resource IDs) after `terraform apply`.|
| `terraform.tfvars` | Supplies concrete values for the declared variables (not committed). |

### Modules (`modules/`)

Modules are **reusable building blocks** that define a logical group of resources. They are called by the environment configs and accept input variables so the same module can be used across dev, staging, and prod with different settings.

| Module      | Responsibility                                                          |
| ----------- | ----------------------------------------------------------------------- |
| `network`   | VPC, subnets, firewall rules, Cloud NAT, etc.                          |
| `compute`   | Compute workloads — Cloud Run services, GCE instances, GKE clusters.   |
| `data`      | Data stores — Cloud SQL, Cloud Storage buckets, Firestore databases.   |

Each module follows the standard three-file convention:

| File           | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `main.tf`      | Resource definitions.                             |
| `variables.tf` | Input variables the module accepts.               |
| `outputs.tf`   | Values the module exposes to the calling config.  |

---

## Getting Started

### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.0
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install)
- Authenticated GCP account with appropriate project permissions

### Authenticate with GCP

```bash
gcloud auth application-default login
```

### Create a tfvars file

Copy the example and fill in real values per environment:

```bash
cp terraform/terraform.tfvars.example terraform/environments/dev/terraform.tfvars
```

### Initialize & Plan (example: dev)

```bash
cd terraform/environments/dev

# Initialize Terraform (downloads providers, sets up backend)
terraform init

# Preview what will be created
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"
```

Replace `dev` with `staging` or `prod` and use the corresponding `terraform.tfvars` file for other environments.

### Destroy Resources

```bash
terraform destroy -var-file="terraform.tfvars"
```

---

## Guidelines

1. **Never apply directly to prod** without a reviewed plan. Always run `terraform plan` first and have it reviewed.
2. **Do not hardcode values** in `main.tf` — use variables and `terraform.tfvars` files.
3. **Keep modules generic.** Modules should not reference a specific environment. Environment-specific values are passed in as variables.
4. **State isolation.** Each environment has its own Terraform state (configured in `provider.tf`). Never share state between environments.
5. **Sensitive values.** Do not commit secrets or service account keys. Use GCP Secret Manager or environment variables.
6. **`terraform.tfvars`.** This file contains environment-specific values. Add it to `.gitignore` if it contains sensitive data.

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
3. Create or update `terraform.tfvars` with environment-specific values.
4. Run `terraform init` and `terraform plan`.
