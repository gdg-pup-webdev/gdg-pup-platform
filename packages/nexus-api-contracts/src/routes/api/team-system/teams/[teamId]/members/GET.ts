import { member } from "#models/teamSystem/index.js";
import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const description = "Get all members of a specific team.";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(member.row),
  ...SchemaFactory.Response.standardErrors(),
};
