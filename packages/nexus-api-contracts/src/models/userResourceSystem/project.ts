import {
  publicArticleUpdateSchema,
  publicUserProjectInsertSchema,
  publicUserProjectRowSchema,
} from "#types/supabase.schema.js"; 

export const row = publicUserProjectRowSchema; 

export const insertDTO = publicUserProjectInsertSchema; 

export const updateDTO = publicArticleUpdateSchema; 
