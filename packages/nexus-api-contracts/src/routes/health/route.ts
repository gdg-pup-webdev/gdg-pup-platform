import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import z from "zod";

export default createRoute({
  path: "/health",
  routes: {
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
  },
});
