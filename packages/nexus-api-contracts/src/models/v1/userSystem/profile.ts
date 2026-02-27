import { cz } from "@packages/typed-rest/shared";

export const userProfileRow = cz.object({
  id: cz.string(),
  updated_at: cz.string(),
  created_at: cz.string(),

  user_id: cz.string(),

  bio: cz.string().nullable(),
  github_url: cz.string().nullable(),
  is_public: cz.boolean(),
  linkedin_url: cz.string().nullable(),
  portfolio_url: cz.string().nullable(),
  program: cz.string().nullable(),
  skills_summary: cz.string().nullable(),
  year_level: cz.number().nullable(),
});

export const userProfileUpdateDTO = userProfileRow
  .omit({
    id: true,
    updated_at: true,
    created_at: true,
    user_id: true,
  })
  .partial();
