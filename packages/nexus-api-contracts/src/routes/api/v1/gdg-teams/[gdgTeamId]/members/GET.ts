import { teamMember } from "#models/v1/teamSystem/member.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const description = "Get all members of a specific team.";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(teamMember),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List members";
export const docs_description = [
  "Purpose: List members.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of members with meta.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  status: "success",
  message: "Fetched successfully",
  data: [
    {
      id: "member-1",
      role: "member",
      team_id: "team-1",
      user_id: "user-1",
    },
  ],
  meta: {
    totalRecords: 1,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
  },
};

export const docs_example_response_400 = {
  status: "error",
  message: "Invalid request.",
  errors: [
    {
      title: "Bad Request",
      detail: "One or more request fields are invalid.",
    },
  ],
};
export const docs_example_response_401 = {
  status: "error",
  message: "Unauthorized.",
  errors: [
    {
      title: "Unauthorized",
      detail: "Missing or invalid authentication token.",
    },
  ],
};
export const docs_example_response_403 = {
  status: "error",
  message: "Forbidden.",
  errors: [
    {
      title: "Forbidden",
      detail: "You do not have permission to access this resource.",
    },
  ],
};
export const docs_example_response_404 = {
  status: "error",
  message: "Member not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No member found for the provided identifier.",
    },
  ],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [
    {
      title: "Internal Server Error",
      detail: "An unexpected error occurred.",
    },
  ],
};
