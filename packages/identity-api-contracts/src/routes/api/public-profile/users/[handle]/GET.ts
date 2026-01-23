 import { SchemaFactory } from "#utils/schemaFactory.utils.js"; 
import { profile } from "#models/userSystem/index.js";

// Response Schema for Public Profile View

export const response = {
  200: SchemaFactory.Response.single(profile.publicProfileResponse),
  ...SchemaFactory.Response.standardErrors(),
};
