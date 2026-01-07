import {
  publicStudyJamInsertSchema,
  publicStudyJamRowSchema,
} from "@/supabase.schema.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { SchemaFactory } from "../../schemaFactory.utils.js";
import z from "zod";

export const studyJamRoutes = createRoutes({
  post: createEndpoint({
    method: "POST",
    request: {
      body: publicStudyJamInsertSchema.omit({
        creator_id: true,
        id: true,
      }),
    },
    response: {
      201: SchemaFactory.Response.single(publicStudyJamRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),

  list: createEndpoint({
    method: "GET",
    request: {
      query: SchemaFactory.Request.Paginated.query(),
    },
    response: {
      200: SchemaFactory.Response.paginated(publicStudyJamRowSchema),
      500: SchemaFactory.Response.error(),
      400: SchemaFactory.Response.error(),
    },
  }),

  studyJam: createRoute({
    path: "/:studyJamId",
    routes: createRoutes({
      get: createEndpoint({
        method: "GET",
        request: {
          params: z.object({
            studyJamId: z.string(),
          }),
        },
        response: {
          200: SchemaFactory.Response.single(publicStudyJamRowSchema),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),
      put: createEndpoint({
        method: "PUT",
        request: {
          params: z.object({
            studyJamId: z.string(),
          }),
          body: publicStudyJamInsertSchema.omit({
            creator_id: true,
            id: true,
          }),
        },
        response: {
          200: SchemaFactory.Response.single(publicStudyJamRowSchema),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),
      delete: createEndpoint({
        method: "DELETE",
        request: {
          params: z.object({
            studyJamId: z.string(),
          }),
        },
        response: {
          200: SchemaFactory.Response.empty(),
          500: SchemaFactory.Response.error(),
          400: SchemaFactory.Response.error(),
          404: SchemaFactory.Response.error(),
        },
      }),
    }),
  }),
});
