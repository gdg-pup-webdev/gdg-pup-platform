# =============================================================================
# Dev Environment - Outputs
# =============================================================================
# Output values for dev environment resources.
# =============================================================================

output "service_url" {
  description = "The URL of the deployed Cloud Run service."
  value       = module.compute.service_url
}

output "firestore_database" {
  description = "The name of the Firestore database."
  value       = module.data.database_name
}
