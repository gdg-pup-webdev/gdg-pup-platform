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

export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  userId: "Optional. Filter transactions by user ID.",
  walletId: "Optional. Filter transactions by wallet ID.",
};
export const docs_summary = "List transactions";
export const docs_description = [
  "Purpose: Retrieve transactions filtered by walletId or userId.",
  "Inputs: Query params pageNumber, pageSize, userId, walletId.",
  "Outputs: Paginated list of transactions with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_response_200 = "Paginated list of transactions.";
export const docs_response_400 = "Invalid query parameters.";
