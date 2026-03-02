# =============================================================================
# Staging Environment - Outputs
# =============================================================================
# Output values for staging environment resources.
# =============================================================================

output "service_urls" {
  description = "Map of service name to deployed Cloud Run URL."
  value       = module.compute.service_urls
}

output "service_names" {
  description = "Map of service key to deployed Cloud Run service name."
  value       = module.compute.service_names
}

output "firestore_database" {
  description = "The name of the Firestore database."
  value       = module.data.database_name
}

