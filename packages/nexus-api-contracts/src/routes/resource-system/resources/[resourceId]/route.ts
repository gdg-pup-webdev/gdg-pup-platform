import { createEndpoint, createRoute } from "@packages/api-typing";

export const resource = createRoute({
  path: "/:resourceId",
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

export default resource;