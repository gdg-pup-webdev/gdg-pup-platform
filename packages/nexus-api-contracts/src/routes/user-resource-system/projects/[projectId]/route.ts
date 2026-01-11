import { createEndpoint, createRoute } from "@packages/api-typing";

export const project = createRoute({
  path: "/:projectId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {},
      response: {},
    }),
    patch: createEndpoint({
      method: "PATCH",
      request: {},
      response: {},
    }),
    delete: createEndpoint({
      method: "DELETE",
      request: {},
      response: {},
    }),
  },
});

export default project;
