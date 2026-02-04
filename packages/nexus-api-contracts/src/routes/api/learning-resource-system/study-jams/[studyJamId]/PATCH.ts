// update the study jam
//
import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(studyJam.update);

export const response = {
  200: SchemaFactory.Response.single(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update study jam";
export const docs_description = [
  "Purpose: Update study jam.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single study jam.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
