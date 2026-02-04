import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get achievement";
export const docs_description = [
  "Purpose: Get achievement.",
  "Inputs: Path params: see schema.",
  "Outputs: Single achievement.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
