import { member } from "#models/teamSystem/index.js";
import { team, teamInsertDTO } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";


export const body = SchemaFactory.Request.withPayload(teamInsertDTO);

export const response = {
    200: SchemaFactory.Response.single(member.row),
    ...SchemaFactory.Response.standardErrors(),
  
}