import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "../../types/supabase.schema.js";
import z from "zod";

export namespace UserModels {
  export const row = publicUserRowSchema;
  export type row = z.infer<typeof row>;

  export const insertDTO = publicUserInsertSchema;
  export type insertDTO = z.infer<typeof insertDTO>;

  export const updateDTO = publicUserUpdateSchema;
  export type updateDTO = z.infer<typeof updateDTO>;
}
