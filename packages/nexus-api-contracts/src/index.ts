import {
  ApiTypes,
  createContract,
  createEndpoint,
  createExpressController,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { z } from "zod";
import { SchemaFactory } from "./schemaFactory.utils.js"; 

const nexusApiRoutes = createRoute({
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

export const Contract = createContract(nexusApiRoutes); 
export type * as Models from "./models/index.js";