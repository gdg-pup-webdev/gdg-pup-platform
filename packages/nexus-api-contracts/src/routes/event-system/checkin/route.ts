import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createRoute } from "@packages/api-typing";

export const checkin = createRoute({
  path: "/checkin",
  routes: {
    post: {
      method: "POST",
      request: {},
      response: {
        200: SchemaFactory.Response.empty(),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
  },
});
