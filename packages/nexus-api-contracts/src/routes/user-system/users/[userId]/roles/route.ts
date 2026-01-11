import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";

export default createRoute({
  path: "/roles",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {},
      response: {
        200: SchemaFactory.Response.single(Models.roleSystem.role.row),
        500: SchemaFactory.Response.error(),
      },
    }),
  },
});
