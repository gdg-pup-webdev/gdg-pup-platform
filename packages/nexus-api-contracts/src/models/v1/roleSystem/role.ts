/**
 * @file role.ts
 * @description Zod model definitions for the User Role entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full user role record. */
export const userRoleRow = cz.object({
  id: cz.string(),
  name: cz.string(),
  description: cz.string(),
});

/** Data Transfer Object for creating a new user role. */
export const userRoleInsertDTO = userRoleRow.omit({
  id: true,
});

/** Data Transfer Object for updating an existing user role. */
export const userRoleUpdateDTO = userRoleInsertDTO.partial();
