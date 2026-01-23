import { member } from "#models/teamSystem/index.js";
import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "@packages/typed-rest";
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
