/**
 * @file teamResource.ts
 * @description Zod model definitions for the Team Resource entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full team resource record. */
export const teamResource = cz.object({
  id: cz.string().uuid(),
  title: cz.string(),
  description: cz.string(),
  resource_link: cz.string().url(),
  resource_type: cz.string(),
  thumbnail_public_url: cz.string(),
  team_name: cz.string(),
  created_at: cz.string().datetime(),
  updated_at: cz.string().datetime(),
});

/** Data Transfer Object for creating a new team resource. */
export const teamResourceInsertDTO = teamResource.omit({
  id: true,
  created_at: true,
  updated_at: true,
  thumbnail_public_url: true,
});

/** Data Transfer Object for updating an existing team resource. */
export const teamResourceUpdateDTO = teamResourceInsertDTO.partial();
