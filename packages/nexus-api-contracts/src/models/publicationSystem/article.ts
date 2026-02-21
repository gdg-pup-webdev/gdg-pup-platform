import {
  publicArticleInsertSchema,
  publicArticleRowSchema,
  publicArticleUpdateSchema,
} from "#types/index.js";

export const row = publicArticleRowSchema;

export const insert = publicArticleInsertSchema;

export const update = publicArticleUpdateSchema;
