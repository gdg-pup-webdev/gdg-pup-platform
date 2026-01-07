import { publicWalletRowSchema } from "@/supabase.schema.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import z from "zod";
import { SchemaFactory } from "../../schemaFactory.utils.js";

export const redeemRoutes = createRoutes({
  put: createEndpoint({
    method: "POST",
    request: {
      body: z.object({
        code: z.string(),
      }),
    },
    response: {
      200: SchemaFactory.Response.single(publicWalletRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
      404: SchemaFactory.Response.error(),
    },
  }),
});
