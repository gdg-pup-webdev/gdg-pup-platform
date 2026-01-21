import { user } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(user.row),
  ...SchemaFactory.Response.standardErrors(),
};
