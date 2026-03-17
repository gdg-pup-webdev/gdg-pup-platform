import { teamResource } from "#models/v1/teamResourceSystem/teamResource.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = cz.object({
  ...OpenApiSchemas.Request.Query.paginated().shape,
  team_name: cz.string().optional(),
  resource_type: cz.string().optional(),
  search: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(teamResource),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List team resources";
export const docs_description = "Retrieve a paginated list of team resources with optional filters.";
