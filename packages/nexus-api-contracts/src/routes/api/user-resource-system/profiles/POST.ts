import { profile } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(profile.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create profiles";
export const docs_description = [
  "Purpose: Create profiles.",
  "Inputs: Body: see schema.",
  "Outputs: Single profile.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
