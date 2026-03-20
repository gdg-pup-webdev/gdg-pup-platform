import { WalletTransactionObject } from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
 
export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(WalletTransactionObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get user points transaction history";
export const docs_description =
  "Returns a paginated list of point transaction records for the given user.";
