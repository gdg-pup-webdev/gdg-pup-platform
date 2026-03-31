export * from "./auth.controller.js";
export * from "./auth.service.js";
export * from "./auth.route.js";

/**
 * @deprecated
 */
import { authRouterInstance } from "./auth.route.js";
/**
 * @deprecated
 */
export const authSystemRouterInstance = authRouterInstance;
