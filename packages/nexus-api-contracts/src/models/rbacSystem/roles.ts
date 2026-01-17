import z from "zod";

export const row = z.object({
  id: z.string(),
  name: z.string(),
  parentRoleId: z.string().optional(),
  description: z.string(),
});

export const insert = row.omit({
  id: true,
});

export const update = insert.partial();
