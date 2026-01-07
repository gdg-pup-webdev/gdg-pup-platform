import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { userRoutes } from "./user.routes.js";

export const userSystemRoutes = createRoutes({
  user: createRoute({
    path: "/:userId",
    routes: userRoutes,
  }),
});
