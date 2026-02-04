import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";
export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.paginated(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List roles";
export const docs_description = [
  "Purpose: List roles.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of roles with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
