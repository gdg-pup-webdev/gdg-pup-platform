import {
  publicTeamInsertSchema,
  publicTeamRowSchema,
  publicTeamUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicTeamRowSchema.extend({
  name: z.string().openapi({
    description: "The name of the team.",
    example: "Core Web Team",
  }),
  description: z.string().openapi({
    description: "A summary of the team's goals or focus area.",
  }),
});

export const insert = publicTeamInsertSchema.extend({
  name: z.string().openapi({ description: "Team name" }),
  description: z.string().openapi({ description: "Team description" }),
});

export const update = publicTeamUpdateSchema.extend({
  name: z.string().optional().openapi({ description: "Update team name" }),
  description: z.string().optional().openapi({ description: "Update team description" }),
});
