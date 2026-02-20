import {
  publicExternalResourceInsertSchema,
  publicExternalResourceRowSchema,
  publicExternalResourceUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicExternalResourceRowSchema.extend({
  title: z.string().openapi({
    description: "The title of the resource.",
    example: "Getting Started with TypeScript",
  }),
  description: z.string().nullable().openapi({
    description: "A summary of what the resource contains.",
  }),
  resource_url: z.string().url().openapi({
    description: "The URL to the external resource.",
  }),
});

export const insertDTO = publicExternalResourceInsertSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
}).extend({
  title: z.string().openapi({ description: "Resource title" }),
  description: z.string().optional().nullable().openapi({ description: "Resource description" }),
  resource_url: z.string().url().openapi({ description: "URL to the resource" }),
});

export const updateDTO = publicExternalResourceUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update resource title" }),
  description: z.string().optional().nullable().openapi({ description: "Update resource description" }),
  resource_url: z.string().url().optional().openapi({ description: "Update resource URL" }),
});
