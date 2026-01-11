import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createEndpoint, createRoute } from "@packages/api-typing";

import transactions from "./transactions/route.js";

export default createRoute({
  path: "/wallet",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {},
      response: {
        200: SchemaFactory.Response.single(Models.economySystem.wallet.row),
        500: SchemaFactory.Response.error(),
      },
    }),
    transactions: transactions,
  },
});
