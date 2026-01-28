/**
 * Shared test helpers for the healthCheck module.
 *
 * Keep helpers here so feature tests can reuse stable fixtures without
 * pulling from production code paths.
 */
export const healthCheckExpectedPayload = {
  status: "success",
  message: "Nexus API: Health check successful",
} as const;
