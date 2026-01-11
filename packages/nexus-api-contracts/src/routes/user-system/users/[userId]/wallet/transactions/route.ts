import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";

export default createRoute({
  path: "/transactions",
  routes: {
    list: createEndpoint({
      method: "GET",
      request: {},
      response: {
        200: SchemaFactory.Response.list(Models.economySystem.transaction.row),
        500: SchemaFactory.Response.error(),
      },
    }),
  },
});
