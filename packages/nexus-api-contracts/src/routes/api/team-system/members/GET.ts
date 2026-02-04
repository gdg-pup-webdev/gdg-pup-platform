import { member } from "#models/teamSystem/index.js";
import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";
export const description = "Get all members of a specific team.";

export const query = SchemaFactory.Request.Paginated.query().extend({
  teamId: z.string().optional(),
  role: z.string().optional(),
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(member.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List members";
export const docs_description = [
  "Purpose: List members.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of members with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
