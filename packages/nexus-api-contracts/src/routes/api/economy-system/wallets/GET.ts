import { wallet } from "#models/economySystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";
export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(wallet.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List wallets";
export const docs_description = [
  "Purpose: List wallets.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of wallets with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": [
    {
      "id": "wallet-1",
      "user_id": "user-1",
      "balance": 120,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
