import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(achievement.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create achievements";
export const docs_description = [
  "Purpose: Create achievements.",
  "Inputs: Body: see schema.",
  "Outputs: Single achievement.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
