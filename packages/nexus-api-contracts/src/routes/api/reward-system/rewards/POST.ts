import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(reward.insert);

export const response = {
  200: SchemaFactory.Response.single(reward.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create rewards";
export const docs_description = [
  "Purpose: Create rewards.",
  "Inputs: Body: see schema.",
  "Outputs: Single reward.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
