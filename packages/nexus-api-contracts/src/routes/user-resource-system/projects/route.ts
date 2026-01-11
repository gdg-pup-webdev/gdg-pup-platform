import { createRoute } from "@packages/api-typing";
import project from "./[projectId]/route.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";

export const projects = createRoute({
  path: "/projects",
  routes: {
    /**
     * list projects regardless of user
     */
    get: {
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.list(Models.userResourceSystem.project.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    post: {
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.userResourceSystem.project.insertDTO
        ),
      },
      response: {
        201: SchemaFactory.Response.single(
          Models.userResourceSystem.project.row
        ),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    project: project,
  },
});

export default projects;
