import {
  createEndpoint,
  createRoute, 
} from "@packages/api-typing";

import user from "./[userId]/route.js";

export default createRoute({
  path: "/users",
  routes: {
    user: user,
  },
});
