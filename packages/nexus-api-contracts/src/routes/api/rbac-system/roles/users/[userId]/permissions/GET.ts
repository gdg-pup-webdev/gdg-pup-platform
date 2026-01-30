import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";

export const response = {
  200: SchemaFactory.Response.list(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};
