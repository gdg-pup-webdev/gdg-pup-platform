import { eventRecord } from "#models/v1/eventSystem/event.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(eventRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get events by team";
export const docs_description = [
  "Purpose: Retrieve a paginated list of events associated with a specific team.",
  "Inputs: Path param: teamId. Query: pageNumber, pageSize.",
  "Outputs: Paginated list of events.",
].join("\n\n");
