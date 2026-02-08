# =============================================================================
# Staging Environment - Variables
# =============================================================================
# Declare staging-specific input variables.
# =============================================================================

variable "project_id" {
  description = "The GCP project ID for the staging environment."
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
  default     = "staging"
}
