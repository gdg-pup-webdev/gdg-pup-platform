# =============================================================================
# DNS Module - Variables
# =============================================================================
# Input variables for Cloudflare DNS configuration.
# =============================================================================

variable "cloudflare_zone_id" {
  description = "The Cloudflare Zone ID for the domain."
  type        = string
}

variable "domain_mappings" {
  description = "Map of service key to subdomain configuration."
  type = map(object({
    subdomain = string
  }))
}
