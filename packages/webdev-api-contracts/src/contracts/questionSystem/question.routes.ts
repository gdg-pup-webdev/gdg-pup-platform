import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import {
  publicQuestionInsertSchema,
  publicQuestionRowSchema,
} from "@/supabase.schema.js";
import z from "zod";
import { SchemaFactory } from "../../schemaFactory.utils.js";
import { answerRoutes } from "./answer.routes.js";

export const questionRoutes = createRoutes({
  /**
   * =================================
   * CREATE
   * =================================
   */
  post: createEndpoint({
    method: "POST",
    request: {
      body: publicQuestionInsertSchema.omit({
        created_at: true,
        creator_id: true,
        id: true,
      }),
    },
    response: {
      201: SchemaFactory.Response.single(publicQuestionRowSchema),
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
            schedule: z.date().optional(),
          })
          .optional(),
      }),
    },
    response: {
      200: SchemaFactory.Response.paginated(publicQuestionRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),

  question: createRoute({
    path: "/:questionId",
    routes: {
      /**
       * =================================
       * GET ONE
       * =================================
       */
      get: createEndpoint({
        method: "GET",
        request: {
          params: z.object({
            questionId: z.string(),
          }),
        },
        response: {
          200: SchemaFactory.Response.single(publicQuestionRowSchema),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),

      /**
       * =================================
       * UPDATE
       * =================================
       */
      put: createEndpoint({
        method: "PUT",
        request: {
          params: z.object({
            questionId: z.string(),
          }),
          body: publicQuestionInsertSchema.omit({
            created_at: true,
            creator_id: true,
            id: true,
          }),
        },
        response: {
          200: z.object({
            status: z.string(),
            message: z.string(),
            data: publicQuestionRowSchema,
          }),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),

      /**
       * =================================
       * DELETE
       * =================================
       */
      delete: createEndpoint({
        method: "DELETE",
        request: {
          params: z.object({
            questionId: z.string(),
          }),
        },
        response: {
          200: z.object({
            status: z.string(),
            message: z.string(),
            data: publicQuestionRowSchema,
          }),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),

      /**
       * =================================
       * ANSWERS TO QUESTION
       * =================================
       */
      answers: createRoute({
        path: "/answers",
        routes: answerRoutes,
      }),
    },
  }),
});
