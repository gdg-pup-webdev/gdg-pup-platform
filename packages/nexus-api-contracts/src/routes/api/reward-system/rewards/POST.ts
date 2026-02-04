import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(reward.insert);

export const response = {
  200: SchemaFactory.Response.single(reward.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create rewards";
export const docs_description = [
  "Purpose: Create rewards.",
  "Inputs: Body: see schema.",
  "Outputs: Single reward.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "title": "Sticker Pack",
    "description": "GDG sticker set",
    "value": 50,
    "user_id": "user-1"
  }
};
export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "reward-1",
    "title": "Sticker Pack",
    "description": "GDG sticker set",
    "value": 50,
    "user_id": "user-1",
    "is_claimed": false,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
};

export const docs_example_response_400 = {
  "status": "error",
  "message": "Invalid request.",
  "errors": [
    {
      "title": "Bad Request",
      "detail": "One or more request fields are invalid."
    }
  ]
};
export const docs_example_response_401 = {
  "status": "error",
  "message": "Unauthorized.",
  "errors": [
    {
      "title": "Unauthorized",
      "detail": "Missing or invalid authentication token."
    }
  ]
};
export const docs_example_response_403 = {
  "status": "error",
  "message": "Forbidden.",
  "errors": [
    {
      "title": "Forbidden",
      "detail": "You do not have permission to access this resource."
    }
  ]
};
export const docs_example_response_404 = {
  "status": "error",
  "message": "Reward not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No reward found for the provided identifier."
    }
  ]
};
export const docs_example_response_500 = {
  "status": "error",
  "message": "Internal server error.",
  "errors": [
    {
      "title": "Internal Server Error",
      "detail": "An unexpected error occurred."
    }
  ]
};
