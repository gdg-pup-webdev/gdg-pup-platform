# =============================================================================
# Dev Environment - Variables
# =============================================================================
# Declare dev-specific input variables.
# =============================================================================

variable "project_id" {
  description = "The GCP project ID for the dev environment."
  type        = string
}

variable "region" {
  description = "The GCP region to deploy resources in."
  type        = string
  default     = "asia-southeast1"
}

variable "image_url" {
  description = "The container image URL to deploy."
  type        = string
  default     = ""
}

variable "allow_unauthenticated" {
  description = "Whether to allow unauthenticated access to the Cloud Run service in dev."
  type        = bool
  default     = true # Often useful in dev, but can be set to false
}

variable "environment" {
  description = "The environment name (e.g., dev, staging, prod)."
  type        = string
  default     = "dev"
}
