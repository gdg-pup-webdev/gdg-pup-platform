import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(role.insert);

export const response = {
  200: SchemaFactory.Response.single(role.insert),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_body = {
  data: {
    role_name: "Name of the role (must be unique)",
    description: "Optional description of the role and its purpose",
  },
};

export const docs_summary = "Create a new role";

export const docs_description =
  "Create a new role in the RBAC system. Role names must be unique across the system. After creation, permissions can be assigned to the role.";

export const docs_response_200 =
  "Successfully created role with generated UUID";

export const docs_response_400 =
  "Bad request - Role name already exists or invalid data provided";

export const docs_response_500 =
  "Internal server error - Failed to create role in database";
