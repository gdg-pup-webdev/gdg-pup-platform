# =============================================================================
# Production Environment - Main Configuration
# =============================================================================
# Define core resources for the production environment by calling reusable modules.
# =============================================================================

# -----------------------------------------------------------------------------
# Compute Module (Cloud Run — identity-api, nexus-api, nexus-web)
# -----------------------------------------------------------------------------
module "compute" {
  source = "../../modules/compute"

  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  services    = var.services
}

# -----------------------------------------------------------------------------
# Data Module (Firebase/Firestore)
# -----------------------------------------------------------------------------
module "data" {
  source = "../../modules/data"

  project_id    = var.project_id
  region        = var.region
  database_type = "FIRESTORE_NATIVE"
  database_name = var.firestore_database_name
  create_database = var.create_firestore_database
}

# -----------------------------------------------------------------------------
# DNS Module (Cloudflare DNS records for custom domains)
# -----------------------------------------------------------------------------
module "dns" {
  source = "../../modules/dns"

  cloudflare_zone_id = var.cloudflare_zone_id
  domain_mappings    = var.domain_mappings
}
