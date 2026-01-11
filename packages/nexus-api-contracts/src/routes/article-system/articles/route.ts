import { createEndpoint, createRoute } from "@packages/api-typing";
import { get } from "node:http";
import article from "./[articleId]/route.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";

export const articles = createRoute({
  path: "/articles",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(Models.articleSystem.article.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    post: createEndpoint({
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.articleSystem.article.insertDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.articleSystem.article.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    article,
  },
});

export default articles;
