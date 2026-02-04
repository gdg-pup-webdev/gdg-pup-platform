import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List certificates";
export const docs_description = [
  "Purpose: List certificates.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of certificates with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
