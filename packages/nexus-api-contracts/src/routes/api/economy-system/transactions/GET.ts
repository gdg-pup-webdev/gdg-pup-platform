import { transaction } from "#models/economySystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js"; 
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "@packages/typed-rest";

extendZodWithOpenApi(z);

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
  walletId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(transaction.row),
  ...SchemaFactory.Response.standardErrors(),
};
