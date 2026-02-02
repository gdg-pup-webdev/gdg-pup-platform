import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";
import { z } from "zod";

export const body = z.object({
  permissionData: z.array(
    permission.insert.omit({
      user_role_id: true,
    }),
  ),
});

export const response = {
  200: SchemaFactory.Response.list(permission.select),
  ...SchemaFactory.Response.standardErrors(),
};
