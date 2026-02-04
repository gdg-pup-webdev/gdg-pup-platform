import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(settings.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create settings";
export const docs_description = [
  "Purpose: Create settings.",
  "Inputs: Body: see schema.",
  "Outputs: Single setting.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
