import {
  publicArticleInsertSchema,
  publicArticleRowSchema,
  publicArticleUpdateSchema,
} from "#types/index.js";
import {
  metadataKeys,
  omitSchema,
  safeOmit,
  standardMetadata,
} from "#utils/model.utils.js";
import z from "zod";

export const row = publicArticleRowSchema;

export const insert = publicArticleInsertSchema;

export const update = publicArticleUpdateSchema;
