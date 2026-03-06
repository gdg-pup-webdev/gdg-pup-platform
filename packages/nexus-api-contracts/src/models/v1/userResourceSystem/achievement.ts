import { cz } from "@packages/typed-rest/shared";

/** Represents a full achievement record from the database. */
export const userAchievementRow = cz.object({
  id: cz.string(),
  created_at: cz.string().nullable(),
  updated_at: cz.string().nullable(),

  user_id: cz.string(),

  title: cz.string(),
  achieved_at: cz.string().nullable(),
  description: cz.string().nullable(),
  image_url: cz.string().nullable(),
});

/** Data Transfer Object for creating a new achievement. */
export const userAchievementInsertDTO = userAchievementRow.omit({
  id: true,
  created_at: true,
  updated_at: true, 
});

/** Data Transfer Object for updating an existing achievement. */
export const userAchievementUpdateDTO = userAchievementInsertDTO.partial();
