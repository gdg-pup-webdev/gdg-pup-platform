import { ApiTypes, createContract, createRoute } from "@packages/api-typing";

import health from "./health/route.js";
import userSystem from "./user-system/route.js";
import { articleSystem } from "./article-system/route.js";
import { eventSystem } from "./event-system/route.js";
import { leaderboardSystem } from "./leaderboard-system/route.js";
import resourceSystem from "./resource-system/route.js";
import { userResourceSystem } from "./user-resource-system/route.js";

export const root = createRoute({
  path: "/api",
  routes: {
    articleSystem,
    eventSystem,
    health,
    leaderboardSystem,
    resourceSystem,
    userResourceSystem,
    userSystem,
  },
});

export default root;