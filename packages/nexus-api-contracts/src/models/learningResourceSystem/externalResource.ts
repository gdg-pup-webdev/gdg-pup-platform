import { publicExternalResourceRowSchema } from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";


export const row = publicExternalResourceRowSchema.extend({
  title: z.string().openapi({
    description: "The title of the external learning resource.",
    example: "Introduction to React Hooks",
  }),
  description: z.string().nullable().openapi({
    description: "A brief summary of what the resource covers.",
  }),
  resource_url: z.string().url().openapi({
    description: "the direct link to the external resource (e.g., YouTube, Medium, GitHub).",
    example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  }),
});

export const insert = row.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export const update = insert.partial();
