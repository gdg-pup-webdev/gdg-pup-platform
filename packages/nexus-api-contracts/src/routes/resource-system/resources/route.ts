import { createRoute } from "@packages/api-typing";
import resource from "./[resourceId]/route.js";

export const resources = createRoute({
  path: "/resources",
  routes: {
    resource,
  },
});
export default resources;