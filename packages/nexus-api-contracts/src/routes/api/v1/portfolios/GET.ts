import { portfolioRow } from "#models/v1/portfolioSystem/portfolio.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  name: cz.string().optional(),
  gdg_id: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(portfolioRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List member portfolios";
export const docs_description = [
  "Purpose: Retrieve a paginated list of member portfolios.",
  "Supports optional filtering by display name or GDG ID.",
  "When `name` is provided, returns portfolios matching that display name.",
  "When `gdg_id` is provided, returns portfolios matching that GDG ID.",
  "Inputs: Query params pageNumber, pageSize, name (optional), gdg_id (optional).",
  "Outputs: Paginated list of portfolios with meta.",
  "Errors: 400, 401, 403, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
export const docs_query = {
  pageNumber: "Page number for pagination (default: 1, minimum: 1)",
  pageSize: "Number of items per page (default: 10, minimum: 1, maximum: 100)",
  name: "Optional. Filter by member display name.",
  gdg_id: "Optional. Filter by GDG member ID.",
};
export const docs_response_200 = "Successfully retrieved paginated list of portfolios.";
