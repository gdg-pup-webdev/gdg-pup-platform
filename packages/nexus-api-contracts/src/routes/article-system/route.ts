import { createRoute } from "@packages/api-typing";
import articles from "./articles/route.js";

export const articleSystem = createRoute({
  path: "/article-system",
  routes: {
    articles,
  },
});
