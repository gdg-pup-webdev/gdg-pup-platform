import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get project";
export const docs_description = [
  "Purpose: Get project.",
  "Inputs: Path params: see schema. Query params: see schema.",
  "Outputs: Single project.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "project-1",
    "user_id": "user-1",
    "title": "Portfolio Site",
    "description": "Personal portfolio.",
    "tech_stack": "Next.js, Tailwind",
    "repo_url": "https://github.com/user/portfolio",
    "demo_url": "https://portfolio.example.com",
    "created_at": "2026-01-01T00:00:00.000Z"
  }
};
