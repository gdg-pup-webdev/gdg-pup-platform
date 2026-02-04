import { permission, role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const description = "List the permissions of a role";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get permission";
export const docs_description = [
  "Purpose: Get permission.",
  "Inputs: Path params: see schema. Query params: see schema.",
  "Outputs: Paginated list of permissions with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response_400 = {
  "status": "error",
  "message": "Invalid request.",
  "errors": [
    {
      "title": "Bad Request",
      "detail": "One or more request fields are invalid."
    }
  ]
};
export const docs_example_response_401 = {
  "status": "error",
  "message": "Unauthorized.",
  "errors": [
    {
      "title": "Unauthorized",
      "detail": "Missing or invalid authentication token."
    }
  ]
};
export const docs_example_response_403 = {
  "status": "error",
  "message": "Forbidden.",
  "errors": [
    {
      "title": "Forbidden",
      "detail": "You do not have permission to access this resource."
    }
  ]
};
export const docs_example_response_404 = {
  "status": "error",
  "message": "Permission not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No permission found for the provided identifier."
    }
  ]
};
export const docs_example_response_500 = {
  "status": "error",
  "message": "Internal server error.",
  "errors": [
    {
      "title": "Internal Server Error",
      "detail": "An unexpected error occurred."
    }
  ]
};

export const docs_example_response = {
  "status": "success",
  "message": "Permissions fetched",
  "data": [
    {
      "id": "perm-1",
      "resource_name": "event",
      "can_read": true,
      "can_write": true,
      "can_update": true,
      "can_delete": true,
      "user_role_id": "role-1"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
