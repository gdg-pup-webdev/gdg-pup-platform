import {
  publicTeamMemberInsertSchema,
  publicTeamMemberRowSchema,
  publicTeamMemberUpdateSchema,
} from "#types/supabase.schema.js";
import z from "zod";

export const row = publicTeamMemberRowSchema;
export const insert = publicTeamMemberInsertSchema;
export const update = publicTeamMemberUpdateSchema;
