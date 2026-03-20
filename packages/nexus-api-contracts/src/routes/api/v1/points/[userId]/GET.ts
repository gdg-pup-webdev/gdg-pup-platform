import { WalletObject } from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
 

export const response = {
  200: WalletObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get user points wallet";
export const docs_description =
  "Returns the points wallet for the given user, including balances for all point types.";
