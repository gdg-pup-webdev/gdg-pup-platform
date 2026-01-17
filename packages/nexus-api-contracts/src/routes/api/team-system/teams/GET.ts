import { team } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(team),
  ...SchemaFactory.Response.standardErrors(),
};
