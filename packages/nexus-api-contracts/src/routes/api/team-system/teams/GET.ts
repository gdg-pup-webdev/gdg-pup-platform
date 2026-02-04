import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List teams";
export const docs_description = [
  "Purpose: List teams.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of teams with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": [
    {
      "id": "team-1",
      "name": "Engineering",
      "description": "Core engineering team"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
