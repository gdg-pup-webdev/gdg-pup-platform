import { createRoute } from "@packages/api-typing";
import comments from "./comments/route.js";

export const article = createRoute({
  path: "/:articleId",
  routes: {
    get: {
      method: "GET",
      request: {},
      response: {},
    },
    patch: {
      method: "PATCH",
      request: {},
      response: {},
    },
    delete: {
      method: "DELETE",
      request: {},
      response: {},
    },
    comments,
  },
});


export default article;