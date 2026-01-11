import { createRoute } from "@packages/api-typing";

export const comments = createRoute({
  path: "/comments",
  routes: {
    get: {
      method: "GET",
      request: {},
      response: {},
    },
  },
});

export default comments;