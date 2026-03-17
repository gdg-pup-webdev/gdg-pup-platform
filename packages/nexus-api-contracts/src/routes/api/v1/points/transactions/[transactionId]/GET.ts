import { WalletTransactionObject } from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
 

export const response = {
  200: WalletTransactionObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get point transaction details";
export const docs_description = "Returns details of a specific point transaction by its ID.";
