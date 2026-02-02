import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  permissionData: permission.insert.omit({
    user_role_id: true,
  }),
});

export const response = {
  200: SchemaFactory.Response.single(permission.select),
  ...SchemaFactory.Response.standardErrors(),
};
