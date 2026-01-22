import { permission, role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(permission.insert);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};
