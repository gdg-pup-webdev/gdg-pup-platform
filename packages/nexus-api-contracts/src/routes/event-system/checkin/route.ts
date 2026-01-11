import { createRoute } from "@packages/api-typing";

export const checkin = createRoute({
  path: "/checkin",
  routes: {
    post: {
      method: "POST",
      request: {},
      response: {},
    },
  },
});
