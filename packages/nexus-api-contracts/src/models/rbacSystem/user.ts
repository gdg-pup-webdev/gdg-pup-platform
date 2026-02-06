/**
 * User model re-export for RBAC system.
 *
 * This provides a local reference to the user model from the User System,
 * maintaining proper module boundaries while avoiding direct cross-system imports
 * throughout the RBAC codebase.
 *
 * Important: This is just a re-export. The User System owns the actual user model.
 */

import { user as userSystemUser } from "#models/userSystem/index.js";

// Re-export user schemas from User System
export const row = userSystemUser.row;
export const insert = userSystemUser.insertDTO;
export const update = userSystemUser.updateDTO;
