import { createRoute } from "@packages/api-typing";
import resources from "./resources/route.js";

export const resourceSystem = createRoute({
  path: "/resource-system",
  routes: {
    resources,
  },
});

export default resourceSystem;
