# =============================================================================
# Compute Module - Outputs
# =============================================================================
# Outputs for service URLs and names.
# =============================================================================

output "service_urls" {
  description = "Map of service name to deployed Cloud Run URL."
  value = {
    for k, svc in google_cloud_run_service.services : k => svc.status[0].url
  }
}

output "service_names" {
  description = "Map of service key to deployed Cloud Run service name."
  value = {
    for k, svc in google_cloud_run_service.services : k => svc.name
  }
}
