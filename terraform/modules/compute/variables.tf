# =============================================================================
# Compute Module - Variables
# =============================================================================
# Input variables for compute instance/service settings.
# =============================================================================

variable "project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "region" {
  description = "The GCP region to deploy to."
  type        = string
}

variable "service_name" {
  description = "The name of the Cloud Run service."
  type        = string
}

variable "image_url" {
  description = "The container image URL to deploy (e.g., gcr.io/project/image:tag)."
  type        = string
}

variable "allow_unauthenticated" {
  description = "Whether to allow unauthenticated (public) access to the service."
  type        = bool
  default     = false
}
