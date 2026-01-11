import { createRoute } from "@packages/api-typing";

export const leaderboardSystem = createRoute({
  path: "/leaderboard-system",
  routes: {
    get: {
      method: "GET",
      request: {},
      response: {},
    },
  },
});
