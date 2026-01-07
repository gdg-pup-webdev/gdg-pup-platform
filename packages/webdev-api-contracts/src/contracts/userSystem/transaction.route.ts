import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { SchemaFactory } from "../../schemaFactory.utils.js";
import z from "zod";
import { publicWalletTransactionRowSchema } from "@/supabase.schema.js";

export const transactionRoutes = createRoute({
  path: "/transactions",
  routes: createRoutes({
    list: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          userId: z.string(),
        }),
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(publicWalletTransactionRowSchema),
        500: SchemaFactory.Response.error(),
        404: SchemaFactory.Response.error(),
      },
    }),
  }),
});
