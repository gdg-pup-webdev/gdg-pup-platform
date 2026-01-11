import { createRoute } from "@packages/api-typing";


export const attendees = createRoute({
    path: "/attendees",
    routes: {
        get: {
            method: "GET",
            request: {},
            response: {},
        },
    },
})
export default attendees;