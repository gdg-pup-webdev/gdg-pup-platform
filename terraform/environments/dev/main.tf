# =============================================================================
# Dev Environment - Main Configuration
# =============================================================================
# Define core resources for the dev environment by calling reusable modules.
# =============================================================================

# -----------------------------------------------------------------------------
# Compute Module (Cloud Run)
# -----------------------------------------------------------------------------
module "compute" {
  source = "../../modules/compute"

  project_id   = var.project_id
  region       = var.region
  service_name = "gdg-pup-platform-${var.environment}"
  
  # Image URL to be updated in CD pipeline or via tfvars. 
  # For now, using a sample image to validate the plan.
  image_url    = var.image_url != "" ? var.image_url : "us-docker.pkg.dev/cloudrun/container/hello"
  
  # Dev environment might want public access temporarily for testing? 
  # Set to false by default for security, override in tfvars if needed.
  allow_unauthenticated = var.allow_unauthenticated
}

# -----------------------------------------------------------------------------
# Data Module (Firebase/Firestore)
# -----------------------------------------------------------------------------
module "data" {
  source = "../../modules/data"

  project_id    = var.project_id
  region        = var.region
  database_type = "FIRESTORE_NATIVE"
}
