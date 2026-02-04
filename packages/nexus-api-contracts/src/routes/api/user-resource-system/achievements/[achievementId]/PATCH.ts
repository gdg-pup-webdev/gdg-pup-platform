import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(achievement.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update achievement";
export const docs_description = [
  "Purpose: Update achievement.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single achievement.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
