import { userRoleJunction } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  roleIds: z.array(z.string()),
});

export const response = {
  200: SchemaFactory.Response.list(userRoleJunction.insert),
  ...SchemaFactory.Response.standardErrors(),
};
