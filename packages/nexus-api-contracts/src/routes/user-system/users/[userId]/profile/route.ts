import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";
import z from "zod";

export default createRoute({
  path: "/profile",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        })
      },
      response: {
        200: SchemaFactory.Response.single(Models.userSystem.profile.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
  },
});
