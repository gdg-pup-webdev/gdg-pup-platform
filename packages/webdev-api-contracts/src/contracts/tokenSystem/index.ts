import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { redeemRoutes } from "./redeem.route.js";
import { templateRoutes } from "./template.route.js";

export const tokenSystemRoutes = createRoutes({
  templates: createRoute({
    path: "/templates",
    routes: templateRoutes,
  }),
  redeem: createRoute({
    path: "/redeem",
    routes: redeemRoutes,
  }),
});
