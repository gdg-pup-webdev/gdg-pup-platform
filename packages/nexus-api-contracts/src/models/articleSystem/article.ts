import {
  publicArticleInsertSchema,
  publicArticleRowSchema,
  publicArticleUpdateSchema,
} from "#types/supabase.schema.js";
import z from "zod";

export const row = publicArticleRowSchema;

export const insertDTO = publicArticleInsertSchema;

export const updateDTO = publicArticleUpdateSchema;
