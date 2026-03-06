export * from "./auth.controller.js";
export * from "./auth.service.js";
export * from "./auth.route.js";

import { authRouterInstance } from "./auth.route.js";
export const authSystemRouterInstance = authRouterInstance;
