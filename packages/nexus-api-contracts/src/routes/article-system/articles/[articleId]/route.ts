import { createRoute } from "@packages/api-typing";
import z from "zod";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";

export const article = createRoute({
  path: "/:articleId",
  routes: {
    get: {
      method: "GET",
      request: {
        params: z.object({
          articleId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.articleSystem.article.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    patch: {
      method: "PATCH",
      request: {
        params: z.object({
          articleId: z.string(),
        }),
        body: SchemaFactory.Request.withPayload(
          Models.articleSystem.article.updateDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.articleSystem.article.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    delete: {
      method: "DELETE",
      request: {
        params: z.object({
          articleId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.empty(),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
  },
});

export default article;
