import { event } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List events";
export const docs_description = [
  "Purpose: List events.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of events with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
