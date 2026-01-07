import {
  publicTokenTemplateInsertSchema,
  publicTokenTemplateRowSchema,
  publicTokenTemplateUpdateSchema,
} from "@/supabase.schema.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { SchemaFactory } from "../../schemaFactory.utils.js";
import z from "zod";
import { tokenRoutes } from "./token.route.js";

export const templateRoutes = createRoutes({
  /**
   * =================================
   * CREATE
   * =================================
   */
  post: createEndpoint({
    method: "POST",
    request: {
      body: publicTokenTemplateInsertSchema.omit({
        creator_id: true,
        id: true,
      }),
    },
    response: {
      201: SchemaFactory.Response.single(publicTokenTemplateRowSchema),
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
      query: SchemaFactory.Request.Paginated.query(),
    },
    response: {
      200: z.object({
        status: z.string(),
        message: z.string(),
        data: publicTokenTemplateRowSchema.array(),
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

  template: createRoute({
    path: "/:templateId",
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
            templateId: z.string(),
          }),
        },
        response: {
          200: SchemaFactory.Response.single(publicTokenTemplateRowSchema),
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
            templateId: z.string(),
          }),
          body: publicTokenTemplateUpdateSchema,
        },
        response: {
          200: SchemaFactory.Response.single(publicTokenTemplateRowSchema),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),

      /**
       * =================================
       * LIST
       * =================================
       */
      delete: createEndpoint({
        method: "DELETE",
        request: {
          params: z.object({
            templateId: z.string(),
          }),
        },
        response: {
          200: publicTokenTemplateRowSchema,
        },
      }),

      /**
       * =================================
       * TOKENS
       * ================================
       */
      tokens: createRoute({
        path: "/tokens",
        routes: tokenRoutes,
      }),
    },
  }),
});
