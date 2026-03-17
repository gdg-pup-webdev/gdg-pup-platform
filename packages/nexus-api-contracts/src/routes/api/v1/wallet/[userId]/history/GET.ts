import { WalletTransactionObject } from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = OpenApiSchemas.Request.Params.id("userId");

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(WalletTransactionObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a user's transaction history";
export const docs_description =
  "Returns a paginated list of point transactions for a given user.";
