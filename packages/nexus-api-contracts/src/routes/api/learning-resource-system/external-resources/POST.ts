// create a new study jam
// side effects:
// - create a new event and attatch it to this study jam
//
// todo:
// - remove the reference id on event model. Resources must reference its event, not the other way around
//
//
//

import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(externalResource.insert);

export const response = {
  200: SchemaFactory.Response.single(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create external resources";
export const docs_description = [
  "Purpose: Create external resources.",
  "Inputs: Body: see schema.",
  "Outputs: Single external resource.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
