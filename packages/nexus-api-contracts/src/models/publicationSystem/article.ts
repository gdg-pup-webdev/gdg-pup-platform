import {
  publicArticleInsertSchema,
  publicArticleRowSchema,
  publicArticleUpdateSchema,
} from "#types/index.js"; 
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicArticleRowSchema.extend({
  title: z.string().openapi({
    description: "The headline of the article.",
    example: "The Future of AI in Web Development",
  }),
  body: z.string().nullable().openapi({
    description: "The main content of the article (supports Markdown).",
  }),
  is_published: z.boolean().openapi({
    description: "Whether the article is visible to the public.",
  }),
});

export const insert = publicArticleInsertSchema.extend({
  title: z.string().openapi({ description: "Article title" }),
  body: z.string().optional().nullable().openapi({ description: "Full article body" }),
});

export const update = publicArticleUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update article title" }),
  body: z.string().optional().nullable().openapi({ description: "Update article body" }),
});
