import { eventRecord } from "#models/v1/eventSystem/event.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  type: cz.string().optional(),
  teamId: cz.string().uuid().optional(),
  teamName: cz.string().optional(),
  category: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(eventRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List events";
export const docs_description = [
  "Purpose: List all events with pagination and filters.",
  "Inputs: Query: type, teamId, teamName, category, pageNumber, pageSize.",
  "Outputs: Paginated list of events.",
].join("\n\n");
