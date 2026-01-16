import {
  publicArticleInsertSchema,
  publicArticleRowSchema,
  publicArticleUpdateSchema,
} from "#types/supabase.schema.js";
import z from "zod";

export namespace ArticleModels {
  export const row = publicArticleRowSchema;
  export type row = z.infer<typeof row>;

  export const insertDTO = publicArticleInsertSchema;
  export type insertDTO = z.infer<typeof insertDTO>;

  export const updateDTO = publicArticleUpdateSchema;
  export type updateDTO = z.infer<typeof updateDTO>;
}
