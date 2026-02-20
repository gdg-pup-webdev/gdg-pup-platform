import {
  publicStudyJamInsertSchema,
  publicStudyJamRowSchema,
  publicStudyJamUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicStudyJamRowSchema.extend({
  title: z.string().openapi({
    description: "The name of the Study Jam session.",
    example: "Modern Web Development with Next.js",
  }),
  description: z.string().openapi({
    description: "A detailed description of the Study Jam topic and goals.",
  }),
  summary: z.string().openapi({
    description: "A short highlight or TL;DR of the session.",
  }),
  recording_url: z.string().url().openapi({
    description: "Link to the session recording (e.g., YouTube link).",
  }),
});

export const insert = publicStudyJamInsertSchema.extend({
  title: z.string().openapi({ description: "Title of the study jam" }),
  description: z.string().openapi({ description: "Full description" }),
  summary: z.string().openapi({ description: "Brief summary" }),
  recording_url: z.string().url().openapi({ description: "URL to the recording" }),
});

export const update = publicStudyJamUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update title" }),
  description: z.string().optional().openapi({ description: "Update description" }),
  summary: z.string().optional().openapi({ description: "Update summary" }),
  recording_url: z.string().url().optional().openapi({ description: "Update recording URL" }),
});
