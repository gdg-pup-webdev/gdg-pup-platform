import {
  publicUserRoleInsertSchema,
  publicUserRoleRowSchema,
  publicUserRoleUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicUserRoleRowSchema.extend({
  name: z.string().openapi({
    description: "The name of the role.",
    example: "Member",
  }),
  description: z.string().openapi({
    description: "A description of what this role can do.",
  }),
});

export const insertDTO = publicUserRoleInsertSchema.extend({
  name: z.string().openapi({ description: "Role name" }),
  description: z.string().openapi({ description: "Role description" }),
});

export const updateDTO = publicUserRoleUpdateSchema.extend({
  name: z.string().optional().openapi({ description: "Update role name" }),
  description: z.string().optional().openapi({ description: "Update role description" }),
});
