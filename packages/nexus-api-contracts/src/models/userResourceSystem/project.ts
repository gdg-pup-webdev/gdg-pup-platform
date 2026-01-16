import {
  publicArticleUpdateSchema,
  publicUserProjectInsertSchema,
  publicUserProjectRowSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";

export const row = publicUserProjectRowSchema;
export type row = Tables<"user_project">;

export const insertDTO = publicUserProjectInsertSchema;
export type insertDTO = TablesInsert<"user_project">;

export const updateDTO = publicArticleUpdateSchema;
export type updateDTO = TablesUpdate<"user_project">;
