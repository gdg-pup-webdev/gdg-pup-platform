import {
  publicArticleCommentInsertSchema,
  publicArticleCommentRowSchema,
  publicArticleCommentUpdateSchema,
} from "#types/supabase.schema.js";
import { z } from "zod";

export namespace ArticleCommentModels {
    export const row = publicArticleCommentRowSchema;
    export type row = z.infer<typeof row>;
  
    export const insertDTO = publicArticleCommentInsertSchema;
    export type insertDTO = z.infer<typeof insertDTO>;

    export const updateDTO = publicArticleCommentUpdateSchema;
    export type updateDTO = z.infer<typeof updateDTO>;
}
