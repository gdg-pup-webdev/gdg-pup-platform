import { createRoute } from "@packages/api-typing";
import projects from "./projects/route.js";

export const userResourceSystem = createRoute({
  path: "/user-resource-system",
  routes: {
    projects: projects,
  },
});
