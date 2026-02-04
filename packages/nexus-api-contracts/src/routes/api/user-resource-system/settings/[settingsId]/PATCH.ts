import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(settings.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update setting";
export const docs_description = [
  "Purpose: Update setting.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single setting.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
