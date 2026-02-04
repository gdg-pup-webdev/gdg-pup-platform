import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(reward.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get reward";
export const docs_description = [
  "Purpose: Get reward.",
  "Inputs: Path params: see schema.",
  "Outputs: Single reward.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
