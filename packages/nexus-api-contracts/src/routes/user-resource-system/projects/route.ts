import { createRoute } from "@packages/api-typing";
import project from "./[projectId]/route.js";

export const projects = createRoute({
  path: "/projects",
  routes: {
    get: {
      method: "GET",
      request: {},
      response: {},
    },
    post: {
      method: "POST",
      request: {},
      response: {},
    },
    project: project,
  },
});

export default projects;