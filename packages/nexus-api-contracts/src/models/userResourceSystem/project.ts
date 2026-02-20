import {
  publicUserProjectInsertSchema,
  publicUserProjectRowSchema,
  publicUserProjectUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicUserProjectRowSchema.extend({
  title: z.string().openapi({
    description: "The name of the project.",
    example: "GDG PUP Platform",
  }),
  description: z.string().nullable().openapi({
    description: "A summary of the project goals and features.",
  }),
  repo_url: z.string().url().nullable().openapi({
    description: "Link to the source code repository (e.g., GitHub).",
  }),
  demo_url: z.string().url().nullable().openapi({
    description: "Link to a live demo of the project.",
  }),
  tech_stack: z.string().nullable().openapi({
    description: "The technologies used in the project (comma-separated).",
    example: "React, TypeScript, Supabase",
  }),
});

export const insertDTO = publicUserProjectInsertSchema.extend({
  title: z.string().openapi({ description: "Project title" }),
  description: z.string().optional().nullable().openapi({ description: "Project description" }),
  repo_url: z.string().url().optional().nullable().openapi({ description: "Repository URL" }),
  demo_url: z.string().url().optional().nullable().openapi({ description: "Live demo URL" }),
  tech_stack: z.string().optional().nullable().openapi({ description: "Tech stack used" }),
  user_id: z.string().openapi({ description: "User ID who owns this project" }),
});

export const updateDTO = publicUserProjectUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update project title" }),
  description: z.string().optional().nullable().openapi({ description: "Update description" }),
  repo_url: z.string().url().optional().nullable().openapi({ description: "Update repository URL" }),
  demo_url: z.string().url().optional().nullable().openapi({ description: "Update demo URL" }),
  tech_stack: z.string().optional().nullable().openapi({ description: "Update tech stack" }),
});
