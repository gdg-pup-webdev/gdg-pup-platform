import { member } from "#models/teamSystem/index.js";
import { row, insert } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const description = "Add a new member to a specific team.";

export const body = SchemaFactory.Request.withPayload(member.insert);

export const response = {
  200: SchemaFactory.Response.single(member.row),
  ...SchemaFactory.Response.standardErrors(),
};
