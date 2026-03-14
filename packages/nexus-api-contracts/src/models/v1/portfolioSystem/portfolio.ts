import { cz } from "@packages/typed-rest/shared";

/**
 * Represents a structured list of social links beyond the primary GitHub/LinkedIn/Portfolio.
 */
export const portfolioSocialLinks = cz.object({
  github_url: cz.string().nullable(),
  linkedin_url: cz.string().nullable(),
  portfolio_website_url: cz.string().nullable(),
  other_links: cz.array(cz.string()),
});

/**
 * Represents the skills and interests section of a portfolio.
 */
export const portfolioSkillsAndInterests = cz.object({
  technical_skills: cz.array(cz.string()),
  learning_interests: cz.array(cz.string()),
  tools_and_technologies: cz.array(cz.string()),
});

/**
 * Full portfolio row — a denormalized view of a member's portfolio,
 * aggregated from the `user` and `user_profile` tables.
 */
export const portfolioRow = cz.object({
  id: cz.string(),
  user_id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  // Personal Information
  full_name: cz.string().nullable(),
  nickname: cz.string().nullable(),
  gdg_id: cz.string().nullable(),
  membership_type: cz.string().nullable(),
  department: cz.string().nullable(),
  year_and_program: cz.string().nullable(),

  // Bio
  bio: cz.string().nullable(),

  // Socials
  github_url: cz.string().nullable(),
  linkedin_url: cz.string().nullable(),
  portfolio_website_url: cz.string().nullable(),
  other_links: cz.array(cz.string()),

  // Skills & Interests
  technical_skills: cz.array(cz.string()),
  learning_interests: cz.array(cz.string()),
  tools_and_technologies: cz.array(cz.string()),

  is_public: cz.boolean(),
});

/**
 * DTO for updating any subset of portfolio properties.
 * All fields are optional — only the provided fields will be updated.
 */
export const portfolioUpdateDTO = portfolioRow
  .omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();
