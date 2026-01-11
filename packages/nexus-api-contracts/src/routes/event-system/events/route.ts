import { createRoute } from "@packages/api-typing";
import event from "./[eventId]/route.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/index.js";

export const events = createRoute({
  path: "/events",
  routes: {
    get: {
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(Models.eventSystem.event.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    post: {
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.eventSystem.event.insertDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.eventSystem.event.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    },
    event: event,
  },
});
