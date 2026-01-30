import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

console.log("role.update schema:", role.update);

export const body = SchemaFactory.Request.withPayload(role.update);

export const response = {
  200: SchemaFactory.Response.single(role.update),
  ...SchemaFactory.Response.standardErrors(),
};
