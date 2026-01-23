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

export const docs_description = "this is the path for economy transactions";
export const docs_summary = "this is the summary";
export const docs_body = "this is the body";
export const docs_response_200 = "galing";
export const docs_response_400 = "bad request agoi";
