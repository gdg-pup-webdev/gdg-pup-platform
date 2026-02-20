import {
  publicUserProfileInsertSchema,
  publicUserProfileRowSchema,
  publicUserProfileUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicUserProfileRowSchema;

export const insertDTO = publicUserProfileInsertSchema.extend({
  bio: z.string().optional().nullable().openapi({
    description: "A short professional or personal biography.",
    example: "Software Engineer at Google Developers Group.",
  }),
  github_url: z.string().url().optional().nullable().openapi({
    description: "Link to the user's GitHub profile.",
  }),
  linkedin_url: z.string().url().optional().nullable().openapi({
    description: "Link to the user's LinkedIn profile.",
  }),
  portfolio_url: z.string().url().optional().nullable().openapi({
    description: "Link to the user's personal portfolio website.",
  }),
  program: z.string().optional().nullable().openapi({
    description: "The academic program or degree the user is enrolled in.",
    example: "BS Computer Engineering",
  }),
  year_level: z.number().optional().nullable().openapi({
    description: "The user's current academic year level.",
    example: 3,
  }),
  skills_summary: z.string().optional().nullable().openapi({
    description: "A summary of the user's professional skills or tech stack.",
    example: "React, TypeScript, Node.js",
  }),
  is_public: z.boolean().optional().openapi({
    description: "Visibility setting for the user's profile.",
    example: true,
  }),
});

export const updateDTO = publicUserProfileUpdateSchema.extend({
  bio: z.string().optional().nullable().openapi({
    description: "Update the user's biography.",
  }),
  github_url: z.string().url().optional().nullable().openapi({
    description: "Update the link to the user's GitHub profile.",
  }),
  linkedin_url: z.string().url().optional().nullable().openapi({
    description: "Update the link to the user's LinkedIn profile.",
  }),
  portfolio_url: z.string().url().optional().nullable().openapi({
    description: "Update the link to the user's portfolio.",
  }),
  program: z.string().optional().nullable().openapi({
    description: "Update the user's academic program.",
  }),
  year_level: z.number().optional().nullable().openapi({
    description: "Update the user's academic year level.",
  }),
  skills_summary: z.string().optional().nullable().openapi({
    description: "Update the summary of skills.",
  }),
  is_public: z.boolean().optional().openapi({
    description: "Update profile visibility.",
  }),
});
