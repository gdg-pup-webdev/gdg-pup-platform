# =============================================================================
# Production Environment - Variables
# =============================================================================
# Declare production-specific input variables.
# =============================================================================

variable "project_id" {
  description = "The GCP project ID for the production environment."
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
  default     = "prod"
}
