import { createEndpoint, createRoute } from "@packages/api-typing";
import attendees from "./attendees/route.js";

export const event = createRoute({
  path: "/:eventId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {},
      response: {},
    }),
    patch: createEndpoint({
      method: "PATCH",
      request: {},
      response: {},
    }),
    delete: createEndpoint({
      method: "DELETE",
      request: {},
      response: {},
    }),
    attendees: attendees,
  },
});

export default event;

