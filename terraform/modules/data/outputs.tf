# =============================================================================
# Data Module - Outputs
# =============================================================================
# Outputs for bucket names, database connection strings, and other data values.
# =============================================================================

output "database_name" {
  description = "The name of the Firestore database."
  value       = google_firestore_database.database.name
}
