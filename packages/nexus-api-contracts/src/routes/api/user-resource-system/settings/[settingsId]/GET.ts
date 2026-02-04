import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get setting";
export const docs_description = [
  "Purpose: Get setting.",
  "Inputs: Path params: see schema.",
  "Outputs: Single setting.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
