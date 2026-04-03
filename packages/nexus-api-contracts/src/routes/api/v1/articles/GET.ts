import { articleRecord } from "#models/v1/articles/record.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  eventId: cz.string().uuid().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(articleRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List articles";
export const docs_description = "Returns a paginated list of articles, optionally filtered by event ID.";
