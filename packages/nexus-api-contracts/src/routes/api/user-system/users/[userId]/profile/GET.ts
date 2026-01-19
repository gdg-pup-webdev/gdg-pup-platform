 import { profile } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};
