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

variable "firestore_database_name" {
  description = "Firestore database name. Use (default) for the default database."
  type        = string
  default     = "(default)"
}

variable "create_firestore_database" {
  description = "Whether Terraform should create Firestore database. Set false when it already exists."
  type        = bool
  default     = false
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
    max_instances         = optional(number, 4)
    container_concurrency = optional(number, 80)
    timeout_seconds       = optional(number, 60)
    custom_domain         = optional(string)
  }))
}

# --- Cloudflare DNS ---

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Zone:DNS:Edit permissions."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the domain (gdgpup.org)."
  type        = string
}

variable "domain_mappings" {
  description = "Map of service key to subdomain for Cloudflare DNS records."
  type = map(object({
    subdomain = string
  }))
  default = {}
}
