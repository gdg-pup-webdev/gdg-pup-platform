import {
  publicTokenInsertSchema,
  publicTokenRowSchema,
} from "@/supabase.schema.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import z from "zod";
import { SchemaFactory } from "../../schemaFactory.utils.js";

export const tokenRoutes = createRoutes({
  /**
   * =================================
   * CREATE
   * =================================
   */
  post: createEndpoint({
    method: "POST",
    request: {
      params: z.object({
        templateId: z.string(),
      }),
      body: publicTokenInsertSchema.omit({
        creator_id: true,
        code: true,
        id: true,
        claimed_at: true,
        claimed_by_id: true,
        is_claimed: true,
        is_voided: true,
      }),
    },
    response: {
      201: SchemaFactory.Response.single(publicTokenRowSchema),
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
      params: z.object({
        templateId: z.string(),
      }),
      query: SchemaFactory.Request.Paginated.query(),
    },
    response: {
      200: z.object({
        status: z.string(),
        message: z.string(),
        data: publicTokenRowSchema.array(),
        meta: z.object({
          totalRecords: z.number(),
          pageSize: z.number(),
          currentPage: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),

  /**
   * =================================
   * GET ONE
   * =================================
   */
  get: createEndpoint({
    method: "GET",
    request: {
      params: z.object({
        templateId: z.string(),
        tokenId: z.string(),
      }),
    },
    response: {
      200: SchemaFactory.Response.single(publicTokenRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
      404: SchemaFactory.Response.error(),
    },
  }),
});
