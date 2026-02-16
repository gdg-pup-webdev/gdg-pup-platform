# =============================================================================
# Data Module - Variables
# =============================================================================
# Input variables for storage and database settings.
# =============================================================================

variable "project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "region" {
  description = "The GCP region for the database."
  type        = string
}

variable "database_type" {
  description = "The type of the database (e.g., FIRESTORE_NATIVE or DATASTORE_MODE)."
  type        = string
  default     = "FIRESTORE_NATIVE"
}
