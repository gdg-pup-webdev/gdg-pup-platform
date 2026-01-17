import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(role.update),
  ...SchemaFactory.Response.standardErrors(),
};
