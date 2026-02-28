# =============================================================================
# DNS Module - Main Configuration
# =============================================================================
# Create Cloudflare DNS CNAME records for Cloud Run custom domains.
# =============================================================================

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

resource "cloudflare_record" "services" {
  for_each = var.domain_mappings

  zone_id         = var.cloudflare_zone_id
  name            = each.value.subdomain
  content         = "ghs.googlehosted.com"
  type            = "CNAME"
  proxied         = false # Cloud Run manages its own SSL; must be DNS-only
  ttl             = 1     # Auto TTL
  allow_overwrite = true  # Take over existing records (e.g. root @ record)
}
