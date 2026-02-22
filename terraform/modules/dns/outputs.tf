# =============================================================================
# DNS Module - Outputs
# =============================================================================
# Output the created DNS record hostnames.
# =============================================================================

output "dns_records" {
  description = "Map of service key to the created DNS record hostname."
  value = {
    for k, record in cloudflare_record.services : k => record.hostname
  }
}
