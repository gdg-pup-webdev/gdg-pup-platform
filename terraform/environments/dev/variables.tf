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

variable "environment" {
  description = "The environment name."
  type        = string
  default     = "dev"
}
