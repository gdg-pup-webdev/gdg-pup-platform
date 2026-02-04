import { transaction, wallet } from "#models/economySystem/index.js";
import { reward } from "#models/rewardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.single(reward.claimResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create claim";
export const docs_description = [
  "Purpose: Create claim.",
  "Inputs: Path params: see schema.",
  "Outputs: Single claim.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "updatedReward": {
      "id": "reward-1",
      "title": "Sticker Pack",
      "description": "GDG sticker set",
      "value": 50,
      "user_id": "user-1",
      "is_claimed": true,
      "created_at": "2026-01-01T00:00:00.000Z"
    },
    "updatedUserWallet": {
      "id": "wallet-1",
      "user_id": "user-1",
      "balance": 70,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    },
    "transaction": {
      "id": "txn-1",
      "wallet_id": "wallet-1",
      "amount": -50,
      "source_type": "reward_claim",
      "source_id": "event-1",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
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
  "message": "Claim not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No claim found for the provided identifier."
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
