import { user } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(user.aggregate),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get aggregate";
export const docs_description = [
  "Purpose: Get aggregate.",
  "Inputs: Path params: see schema.",
  "Outputs: Single aggregate.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "user-1",
    "email": "user@example.com",
    "gdg_id": "gdg-1",
    "display_name": "User One",
    "first_name": null,
    "last_name": null,
    "avatar_url": null,
    "status": "active",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "profiles": [
      {
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
    ],
    "projects": [
      {
        "id": "project-1",
        "user_id": "user-1",
        "title": "Portfolio Site",
        "description": "Personal portfolio.",
        "tech_stack": "Next.js, Tailwind",
        "repo_url": "https://github.com/user/portfolio",
        "demo_url": "https://portfolio.example.com",
        "created_at": "2026-01-01T00:00:00.000Z"
      }
    ],
    "wallets": [
      {
        "id": "wallet-1",
        "user_id": "user-1",
        "balance": 120,
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      }
    ],
    "achievements": [],
    "certificates": [],
    "settings": []
  }
};
