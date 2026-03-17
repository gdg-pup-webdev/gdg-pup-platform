import { WalletObject } from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = OpenApiSchemas.Request.Params.id("userId");

export const response = {
  200: WalletObject,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a user's wallet";
export const docs_description = "Returns the wallet (all point type balances) for a given user.";
