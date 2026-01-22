import {
  publicArticleCommentInsertSchema,
  publicArticleCommentRowSchema,
  publicArticleCommentUpdateSchema,
} from "#types/supabase.schema.js";
import { z } from "zod";

export const row = publicArticleCommentRowSchema;

export const insertDTO = publicArticleCommentInsertSchema;

export const updateDTO = publicArticleCommentUpdateSchema;
