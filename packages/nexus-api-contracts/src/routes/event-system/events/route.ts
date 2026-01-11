import { createRoute } from "@packages/api-typing";
import event from "./[eventId]/route.js";

export const events = createRoute({
  path: "/events",
  routes: {
    get: {
      method: "GET",
      request: {},
      response: {},
    },
    post: {
      method: "POST",
      request: {},
      response: {},
    },
    event: event,
  },
});
