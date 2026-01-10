import {
  ApiTypes,
  createContract,
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing"; 
import { healthCheckRoutes } from "./healthCheck/index.js";
import { userSystemRoutes } from "./userSystem/index.js";

export const nexusApiRoutes = createRoute({
  path: "/api",
  routes: createRoutes({
    health: createRoute({
      path: "/health",
      routes: healthCheckRoutes,
    }),
    users: createRoute({
      path: "/users",
      routes: userSystemRoutes
    }),
  }),
});

export const nexusApiContract = createContract(nexusApiRoutes);
export type NexusApiTypes = ApiTypes<typeof nexusApiRoutes>;
