import { createEndpoint, createRoute } from "@packages/api-typing";
import attendees from "./attendees/route.js";
import z from "zod";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";

export const event = createRoute({
  path: "/:eventId",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        params: z.object({
          eventId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.eventSystem.event.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    patch: createEndpoint({
      method: "PATCH",
      request: {
        params: z.object({
          eventId: z.string(),
        }),
        body: SchemaFactory.Request.withPayload(
          Models.eventSystem.event.updateDTO
        ),
      },
      response: {
        200: SchemaFactory.Response.single(Models.eventSystem.event.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    delete: createEndpoint({
      method: "DELETE",
      request: {
        params: z.object({
          eventId: z.string(),
        }),
      },
      response: {
        200: SchemaFactory.Response.single(Models.eventSystem.event.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),
    attendees: attendees,
  },
});

export default event;
