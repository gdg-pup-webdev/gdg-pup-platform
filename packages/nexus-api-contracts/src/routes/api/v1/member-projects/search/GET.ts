import { memberProjectsRecord } from "#models/v1/memberProjects/record.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  query: cz.string().min(1),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(memberProjectsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Search member projects";
export const docs_description = "Searches for member projects by title or description.";
