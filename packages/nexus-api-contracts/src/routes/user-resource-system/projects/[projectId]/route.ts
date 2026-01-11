import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";
import z from "zod";

export const project = createRoute({
  path: "/:projectId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
        params: z.object({
          projectId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(
          Models.userResourceSystem.project.row
        ),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    patch: createEndpoint({
      method: "PATCH",
      request: {
        params: z.object({
          projectId: z.string(),
        }),
        body: SchemaFactory.Request.withPayload(
          Models.userResourceSystem.project.updateDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(
          Models.userResourceSystem.project.row
        ),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    delete: createEndpoint({
      method: "DELETE",
      request: {
        params: z.object({
          projectId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.empty(),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
  },
});

export default project;
