import z from "zod";

export const row = z.object({
  id: z.string(),
  roleId: z.string(),
  resource: z.string(),
  canCreate: z.boolean(),
  canRead: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
  isInherited: z.boolean(),
  inheritedFromParentId: z.string().optional(),
});

export const insert = row.omit({
  id: true,
  roleId: true,
});

export const update = insert.partial();
