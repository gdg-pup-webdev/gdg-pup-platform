import { transaction } from "#models/economySystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
  walletId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(transaction.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List transactions of a user";
export const docs_description =
  "List transactions filtered by walletId or userId"; 
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
