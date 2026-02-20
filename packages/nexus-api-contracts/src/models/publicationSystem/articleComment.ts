import {
  publicArticleCommentInsertSchema,
  publicArticleCommentRowSchema,
  publicArticleCommentUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicArticleCommentRowSchema.extend({
  body: z.string().openapi({
    description: "The content of the comment.",
    example: "This article was very helpful, thanks!",
  }),
});

export const insertDTO = publicArticleCommentInsertSchema.extend({
  body: z.string().openapi({ description: "Comment content" }),
  article_id: z.string().optional().openapi({ description: "ID of the article being commented on" }),
});

export const updateDTO = publicArticleCommentUpdateSchema.extend({
  body: z.string().optional().openapi({ description: "Update comment content" }),
});
