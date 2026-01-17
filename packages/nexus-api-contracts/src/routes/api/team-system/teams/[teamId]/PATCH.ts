import { models } from "#contract.js";
import { team, teamUpdateDTO } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(teamUpdateDTO);

export const response = {
  200: SchemaFactory.Response.single(team),
  ...SchemaFactory.Response.standardErrors(),
}; 