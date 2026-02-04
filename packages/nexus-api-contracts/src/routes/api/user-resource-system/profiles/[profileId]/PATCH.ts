import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(project.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update profile";
export const docs_description = [
  "Purpose: Update profile.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single profile.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
