import { userRoleJunction } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(userRoleJunction.row),
  ...SchemaFactory.Response.standardErrors(),
};
