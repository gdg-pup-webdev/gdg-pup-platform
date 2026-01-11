import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { createRoute } from "@packages/api-typing";
import z from "zod";


export const attendees = createRoute({
    path: "/attendees",
    routes: {
        list: {
            method: "GET",
            request: {
                params: z.object({
                    eventId: z.string(),
                }),
                query: SchemaFactory.Request.Paginated.query(),
            },
            response: {
                200: SchemaFactory.Response.paginated(Models.eventSystem.attendee.row),
                ...SchemaFactory.Response.standardErrors(),
            },
        },
    },
})
export default attendees;