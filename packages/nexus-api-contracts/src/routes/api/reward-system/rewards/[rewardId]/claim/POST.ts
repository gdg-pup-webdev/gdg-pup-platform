import { transaction, wallet } from "#models/economySystem/index.js";
import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.single(reward.claimResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create claim";
export const docs_description = [
  "Purpose: Create claim.",
  "Inputs: Path params: see schema.",
  "Outputs: Single claim.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
