import { createEndpoint, createRoute } from "@packages/api-typing";
import resource from "./[resourceId]/route.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";

export const resources = createRoute({
  path: "/resources",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(
          Models.resourceSystem.resource.row
        ),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    post: createEndpoint({
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.resourceSystem.resource.insertDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.resourceSystem.resource.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    resource,
  },
});
export default resources;
