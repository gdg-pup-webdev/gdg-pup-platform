import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(Models.userSystem.profile.row),
  ...SchemaFactory.Response.standardErrors(),
};
