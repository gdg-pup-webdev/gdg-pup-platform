import {
  publicQuestionAnswerInsertSchema,
  publicQuestionAnswerRowSchema,
} from "@/supabase.schema.js";
import z from "zod";
import { SchemaFactory } from "../../schemaFactory.utils.js";

import { createEndpoint, createRoutes } from "@packages/api-typing";

export const answerRoutes = createRoutes({
  /**
   * =================================
   * CREATE
   * =================================
   */
  post: createEndpoint({
    method: "POST",
    request: {
      params: z.object({
        questionId: z.string(),
      }),
      body: publicQuestionAnswerInsertSchema.omit({
        id: true,
        created_at: true,
        is_correct: true,
        user_id: true,
      }),
    },
    response: {
      200: SchemaFactory.Response.single(publicQuestionAnswerRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),

  /**
   * =================================
   * LIST
   * =================================
   */
  list: createEndpoint({
    method: "GET",
    request: {
      query: SchemaFactory.Request.Paginated.query().extend({
        filters: z
          .object({
            userId: z.string().optional(),
          })
          .optional(),
      }),
      params: z.object({
        questionId: z.union([z.string(), z.literal("-")]),
      }),
    },
    response: {
      200: SchemaFactory.Response.paginated(publicQuestionAnswerRowSchema),
      500: SchemaFactory.Response.error(),
      404: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),
});
