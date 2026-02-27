import { cz } from "@packages/typed-rest/shared";

export const userPoints = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  user_id: cz.string(),

  balance: cz.number(),
});

export const userPointsUpdateDTO = userPoints
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    user_id: true,
  })
  .partial();
