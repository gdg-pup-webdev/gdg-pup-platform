import { createEndpoint, createRoute } from "@packages/api-typing";
import { get } from "node:http";
import article from "./[articleId]/route.js";

export const articles = createRoute({
  path: "/articles",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {},
      response: {},
    }),
    post: createEndpoint({
      method: "POST",
      request: {},
      response: {},
    }),
    article,
  },
});

export default articles;