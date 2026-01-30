import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(role.insert);

export const response = {
  200: SchemaFactory.Response.single(role.row),
  ...SchemaFactory.Response.standardErrors(),
};
