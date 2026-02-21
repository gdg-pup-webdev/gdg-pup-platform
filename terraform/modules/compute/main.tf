# =============================================================================
# Compute Module - Main Configuration
# =============================================================================
# Deploy multiple Cloud Run services from a services map.
# =============================================================================

resource "google_cloud_run_service" "services" {
  for_each = var.services

  name     = "${each.key}-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = tostring(each.value.min_instances)
        "autoscaling.knative.dev/maxScale" = tostring(each.value.max_instances)
        "run.googleapis.com/cpu-throttling" = "true"
      }
    }

    spec {
      container_concurrency = each.value.container_concurrency
      timeout_seconds       = each.value.timeout_seconds

      containers {
        image = each.value.image_url

        ports {
          container_port = each.value.container_port
        }

        dynamic "env" {
          for_each = each.value.env_vars
          content {
            name  = env.key
            value = env.value
          }
        }

        resources {
          limits = {
            cpu    = each.value.cpu
            memory = each.value.memory
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow unauthenticated access per service (when enabled)
resource "google_cloud_run_service_iam_member" "public_access" {
  for_each = {
    for k, v in var.services : k => v if v.allow_unauthenticated
  }

  service  = google_cloud_run_service.services[each.key].name
  location = google_cloud_run_service.services[each.key].location
  project  = google_cloud_run_service.services[each.key].project
  role     = "roles/run.invoker"
  member   = "allUsers"
}
