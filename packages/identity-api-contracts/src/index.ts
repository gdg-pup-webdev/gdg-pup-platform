import {
  ApiTypes,
  createContract,
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { z } from "zod";
import { SchemaFactory } from "@/schemaFactory.utils.js";

export const identityApiRoutes = createRoute({
  path: "/api",
  routes: createRoutes({
    health: createRoute({
      path: "/health",
      routes: createRoutes({
        get: createEndpoint({
          method: "GET",
          request: {},
          response: {
            200: z.object({
              status: z.string(),
              message: z.string(),
            }),
            500: SchemaFactory.Response.error(),
          },
        }),
      }),
    }),
  }),
});

export const identityApiContract = createContract(identityApiRoutes);
export type IdentityApiTypes = ApiTypes<typeof identityApiRoutes>;

// identityApiContract.health.get.