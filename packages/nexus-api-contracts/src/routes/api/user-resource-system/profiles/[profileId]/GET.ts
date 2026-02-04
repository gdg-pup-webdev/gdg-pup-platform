import { profile } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get profile";
export const docs_description = [
  "Purpose: Get profile.",
  "Inputs: Path params: see schema.",
  "Outputs: Single profile.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "profile-1",
    "user_id": "user-1",
    "bio": "Building web apps.",
    "program": "Computer Science",
    "year_level": 3,
    "skills_summary": "TypeScript, React, Node",
    "is_public": true,
    "github_url": "https://github.com/user",
    "linkedin_url": "https://linkedin.com/in/user",
    "portfolio_url": "https://example.com",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
};
