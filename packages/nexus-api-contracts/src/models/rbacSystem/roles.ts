/**
 * @file roles.ts
 * @description Zod model definitions for User Roles.
 */

import z from "zod";

export const permission = z.object({
  resource_name: z.string(),
  action: z.string(),
});

export const role = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  id: z.string(),
});

export const roleInsert = role.omit({
  id: true,
});

export const roleUpdate = roleInsert.partial();

export const roleAggregate = role.extend({
  permissions: z.array(permission),
});
