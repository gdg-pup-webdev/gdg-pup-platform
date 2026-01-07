import { publicWalletRowSchema } from "@/supabase.schema.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import z from "zod";
import { SchemaFactory } from "../../schemaFactory.utils.js";
import { transactionRoutes } from "./transaction.route.js";

export const walletRoutes = createRoute({
  path: "/wallet",
  routes: createRoutes({
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      response: {
        200: z.object({
          status: z.string(),
          message: z.string(),
          data: publicWalletRowSchema,
        }),
        500: SchemaFactory.Response.error(),
        404: SchemaFactory.Response.error(),
      },
    }),
    transactions: transactionRoutes,
  }),
});
