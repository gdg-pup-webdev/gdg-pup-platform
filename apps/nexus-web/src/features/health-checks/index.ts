/**
 * Barrel export for health-checks feature
 *
 * This allows easy importing of the entire feature:
 * import { HealthChecksGrid, useNexusHealthCheck } from '@/features/health-checks';
 */

// Components
export * from "./components";

// Hooks
export {
  useNexusHealthCheck,
  useIdentityHealthCheck,
} from "./hooks/useHealthChecks";

// API functions
export { checkNexusHealth } from "./api/checkNexusHealth";
export { checkIdentityHealth } from "./api/checkIdentityHealth";

// Types
export * from "./types";
