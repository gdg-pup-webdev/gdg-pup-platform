# =============================================================================
# Data Module - Main Configuration
# =============================================================================
# Define data/storage resources (e.g., Cloud Storage buckets, Cloud SQL, Firestore).
# =============================================================================

# Enable required APIs
resource "google_project_service" "firestore" {
  project = var.project_id
  service = "firestore.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "firebase" {
  project = var.project_id
  service = "firebase.googleapis.com"

  disable_on_destroy = false
}

# Provision the Firestore Database
resource "google_firestore_database" "database" {
  count = var.create_database ? 1 : 0

  project     = var.project_id
  name        = var.database_name
  location_id = var.region
  type        = var.database_type

  depends_on = [google_project_service.firestore]
}

# Note: Security rules (google_firebaserules_ruleset) can be complex and are often managed via 
# the Firebase CLI or separate files. For now, we initialize the database.
