 
import { team } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js"; 
import {member} from "#models/teamSystem/index.js"; 

export const response = {
  200: SchemaFactory.Response.single(member.row),
  ...SchemaFactory.Response.standardErrors(),
};
