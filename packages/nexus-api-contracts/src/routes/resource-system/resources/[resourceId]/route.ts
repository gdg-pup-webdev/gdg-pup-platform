import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";
import z from "zod";

export const resource = createRoute({
  path: "/:resourceId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          resourceId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.resourceSystem.resource.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    patch: createEndpoint({
      method: "PATCH",
      request: {
        params: z.object({
          resourceId: z.string(),
        }),
        body: SchemaFactory.Request.withPayload(
          Models.resourceSystem.resource.updateDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.resourceSystem.resource.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    delete: createEndpoint({
      method: "DELETE",
      request: {
        params: z.object({
          resourceId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.empty(),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
  },
});

export default resource;
