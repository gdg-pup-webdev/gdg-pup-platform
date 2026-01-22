import {
  publicUserProfileInsertSchema,
  publicUserProfileRowSchema,
  publicUserProfileUpdateSchema,
} from "../../types/supabase.schema.js";
import z from "zod";

export namespace UserProfileModels {
  export const row = publicUserProfileRowSchema;
  export type row = z.infer<typeof row>;

  export const insertDTO = publicUserProfileInsertSchema;
  export type insertDTO = z.infer<typeof insertDTO>;

  export const updateDTO = publicUserProfileUpdateSchema;
  export type updateDTO = z.infer<typeof updateDTO>;
}
