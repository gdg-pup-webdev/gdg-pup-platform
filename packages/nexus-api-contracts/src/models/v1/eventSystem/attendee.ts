/**
 * @file attendee.ts
 * @description Zod model definitions for the Event Attendee entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents an event attendee (a user record in the context of event attendance). */
export const eventAttendeeRow = cz.object({
    id: cz.string(),
    created_at: cz.string(),
    updated_at: cz.string(),

    avatar_url: cz.string().nullable(),
    display_name: cz.string(),
    email: cz.string(),
    first_name: cz.string().nullable(),
    last_name: cz.string().nullable(),
    gdg_id: cz.string().nullable(),
    status: cz.string(),
});
