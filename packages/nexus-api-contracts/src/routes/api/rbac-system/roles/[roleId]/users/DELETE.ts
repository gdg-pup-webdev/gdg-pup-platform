import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  userId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  roleId: "UUID of the role to remove",
};

export const docs_body = {
  userId: "UUID of the user to remove the role to",
};

export const docs_summary = "Remove a role from a user";
export const docs_description =
  "Remove a specific role assignment from a user. The user will no longer have permissions associated with this role.";
export const docs_response_200 = "Successfully removed role from user";
export const docs_response_404 = "User-role assignment not found";
export const docs_response_500 =
  "Internal server error - Failed to remove role";
