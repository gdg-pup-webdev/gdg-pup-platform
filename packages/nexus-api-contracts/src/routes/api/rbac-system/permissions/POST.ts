import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";

export const body = SchemaFactory.Request.withPayload(permission.insert);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};
