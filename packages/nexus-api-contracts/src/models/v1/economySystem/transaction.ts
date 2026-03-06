import { cz } from "@packages/typed-rest/shared";

export const userPointsTransactionRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  source_reference: cz.string(),
  source_type: cz.string(),

  user_id: cz.string(),

  amount: cz.number(),
});
