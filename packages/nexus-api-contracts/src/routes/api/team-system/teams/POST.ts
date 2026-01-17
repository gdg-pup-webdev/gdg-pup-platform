import { team, teamInsertDTO } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";


export const body = SchemaFactory.Request.withPayload(teamInsertDTO);

export const response = {
    200: SchemaFactory.Response.single(team),
    ...SchemaFactory.Response.standardErrors(),
  
}