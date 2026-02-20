/**
 * @file roles.ts
 * @description Zod model definitions for User Roles.
 */

import { cz as z } from "@packages/typed-rest/shared";


export const permission = z.object({
  resource_name: z.string().openapi({
    description: "The name of the resource (e.g., 'user', 'event', 'article').",
    example: "event",
  }),
  action: z.string().openapi({
    description: "The allowed action on the resource (e.g., 'create', 'read', 'update', 'delete').",
    example: "create",
  }),
});

export const role = z.object({
  name: z.string().min(1).openapi({
    description: "The unique name of the role.",
    example: "Admin",
  }),
  description: z.string().min(1).openapi({
    description: "A brief description of the role's responsibilities.",
    example: "Has full access to all system resources.",
  }),
  id: z.string().openapi({
    description: "The unique identifier for the role.",
  }),
});

export const roleInsert = role.omit({
  id: true,
});

export const roleUpdate = roleInsert.partial();

export const roleAggregate = role.extend({
  permissions: z.array(permission).openapi({
    description: "The list of permissions associated with this role.",
  }),
});
