import { createRoute } from "@packages/api-typing";
import { checkin } from "./checkin/route.js";
import { events } from "./events/route.js";

export const eventSystem = createRoute({
  path: "/event-system",
  routes: {
    events,
    checkin,
  },
});

