import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { userRoleJunction } from "#models/rbacSystem/index.js";

export const body = z.object({
  userIds: z.array(z.string()),
});

export const response = {
  200: SchemaFactory.Response.list(userRoleJunction.row),
  ...SchemaFactory.Response.standardErrors(),
};
