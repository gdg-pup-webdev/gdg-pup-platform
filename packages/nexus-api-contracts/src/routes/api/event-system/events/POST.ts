import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

 export const body = SchemaFactory.Request.withPayload(event.insertDTO);

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create events";
export const docs_description = [
  "Purpose: Create events.",
  "Inputs: Body: see schema.",
  "Outputs: Single event.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
