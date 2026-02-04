import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(project.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create projects";
export const docs_description = [
  "Purpose: Create projects.",
  "Inputs: Body: see schema.",
  "Outputs: Single project.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
