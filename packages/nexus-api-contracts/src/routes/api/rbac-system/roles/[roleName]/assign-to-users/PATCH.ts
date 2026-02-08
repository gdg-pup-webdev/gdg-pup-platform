import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = SchemaFactory.Request.withPayload(z.object({
  userId: z.string(),
}));

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Assign a role to a user";

export const docs_description =
  "Assign a specific role to a user, granting them all permissions associated with that role. Users can have multiple roles assigned simultaneously. This returns a list of all roles assigned to the user.";

export const docs_params = {
  roleId: "UUID of the role to assign to the user",
};

export const docs_body = {
  userId: "UUID of the user to receive the role assignment",
};

export const docs_response_200 =
  "Successfully assigned role to user - returns the junction record with user_id, role_id, and assignment timestamp";

export const docs_response_400 =
  "Bad request - User already has this role assigned (duplicate assignment prevented)";

export const docs_response_404 =
  "Not found - Either the user or role does not exist in the database";

export const docs_response_500 =
  "Internal server error - Failed to create role assignment in database";
