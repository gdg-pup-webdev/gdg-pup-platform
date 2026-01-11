import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";

import users from "./users/route.js";

export default createRoute({
  path: "/user-system",
  routes: {
    users: users,
  },
});
