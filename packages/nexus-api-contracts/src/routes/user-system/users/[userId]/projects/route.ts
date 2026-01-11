import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";
import z, { Schema } from "zod";

export const projects = createRoute({
  path: "/projects",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        }),
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.list(Models.userResourceSystem.project.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
  },
});
