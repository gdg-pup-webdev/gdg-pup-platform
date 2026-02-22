# =============================================================================
# Dev Environment - Provider Configuration
# =============================================================================
# Configure the Google Cloud and Cloudflare providers for the dev environment.
# =============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # backend "gcs" {
  #   bucket = "gdg-pup-platform-tfstate-dev"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
