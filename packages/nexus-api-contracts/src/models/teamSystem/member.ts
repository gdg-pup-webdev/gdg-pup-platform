import {
  publicTeamMemberInsertSchema,
  publicTeamMemberRowSchema,
  publicTeamMemberUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicTeamMemberRowSchema.extend({
  role: z.string().openapi({
    description: "The role of the user within the team (e.g., 'Lead', 'Developer', 'Designer').",
    example: "Lead Developer",
  }),
  team_id: z.string().openapi({
    description: "The unique ID of the team.",
  }),
  user_id: z.string().openapi({
    description: "The unique ID of the user.",
  }),
});

export const insert = publicTeamMemberInsertSchema.extend({
  role: z.string().openapi({ description: "Member role in team" }),
  team_id: z.string().openapi({ description: "Target team ID" }),
  user_id: z.string().openapi({ description: "User ID to add" }),
});

export const update = publicTeamMemberUpdateSchema.extend({
  role: z.string().optional().openapi({ description: "Update member role" }),
});
