import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";

import transactions from "./transactions/route.js";
import z from "zod";

export default createRoute({
  path: "/wallet",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.economySystem.wallet.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    transactions: transactions,
  },
});
