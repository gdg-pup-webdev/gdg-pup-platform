import { publicQuestionStreakRowSchema } from "@/supabase.schema.js";
import { SchemaFactory } from "../../schemaFactory.utils.js";

import { createEndpoint, createRoutes } from "@packages/api-typing";

export const streakRoutes = createRoutes({
  list: createEndpoint({
    method: "GET",
    request: {},
    response: {
      200: SchemaFactory.Response.paginated(publicQuestionStreakRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),
});
