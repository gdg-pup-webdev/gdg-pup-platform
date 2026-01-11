import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";
import wallet from "./wallet/route.js";
import profile from "./profile/route.js";
import roles from "./roles/route.js";
import z from "zod";

export default createRoute({
  path: "/:userId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.userSystem.user.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    wallet: wallet,
    profile: profile,
    roles: roles,
  },
});
