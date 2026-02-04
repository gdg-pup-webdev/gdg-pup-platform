import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(reward.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List rewards";
export const docs_description = [
  "Purpose: List rewards.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of rewards with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
