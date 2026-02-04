import { userRoleJunction } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  userId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.single(userRoleJunction.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  roleId: "UUID of the role to assign",
};

export const docs_body = {
  userId: "UUID of the user to assign the role to",
};

export const docs_summary = "Assign a role to a user";
export const docs_description =
  "Assign a specific role to a user. Users can have multiple roles. Cannot assign the same role twice to the same user.";
export const docs_response_200 = "Successfully assigned role to user";
export const docs_response_400 =
  "Bad request - User already has this role assigned";
export const docs_response_404 = "User or role not found";
export const docs_response_500 =
  "Internal server error - Failed to assign role";
