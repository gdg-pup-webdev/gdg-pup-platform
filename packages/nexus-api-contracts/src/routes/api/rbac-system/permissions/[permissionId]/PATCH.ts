import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(permission.update);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
};
