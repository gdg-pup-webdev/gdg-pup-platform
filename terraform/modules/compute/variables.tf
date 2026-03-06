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

variable "environment" {
  description = "The environment name (e.g., dev, staging, prod)."
  type        = string
}

variable "services" {
  description = "Map of Cloud Run services to deploy. Key is the service name suffix."
  type = map(object({
    image_url             = string
    allow_unauthenticated = optional(bool, false)
    container_port        = optional(number, 8080)
    env_vars              = optional(map(string), {})
    cpu                   = optional(string, "1")
    memory                = optional(string, "512Mi")
    min_instances         = optional(number, 0)
    max_instances         = optional(number, 2)
    container_concurrency = optional(number, 80)
    timeout_seconds       = optional(number, 60)
    custom_domain         = optional(string)
  }))
}
