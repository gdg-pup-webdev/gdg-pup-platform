import {
  publicEventInsertSchema,
  publicEventRowSchema,
  publicEventUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";

export namespace EventModels {
  export const row = publicEventRowSchema;
  export type row = Tables<"event">;

  export const insertDTO = publicEventInsertSchema;
  export type insertDTO = TablesInsert<"event">;

  export const updateDTO = publicEventUpdateSchema;
  export type updateDTO = TablesUpdate<"event">;
}
