import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoutes } from "@packages/api-typing";
import z from "zod";

export const healthCheckRoutes = createRoutes({
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
});
