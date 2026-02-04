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
