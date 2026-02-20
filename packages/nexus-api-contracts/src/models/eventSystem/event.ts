import {
  publicEventInsertSchema,
  publicEventRowSchema,
  publicEventUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicEventRowSchema;

export const insertDTO = publicEventInsertSchema.extend({
  title: z.string().openapi({
    description: "The title of the event.",
    example: "GDG Cloud DevFest 2026",
  }),
  description: z.string().optional().nullable().openapi({
    description: "A detailed description of the event, including its purpose and agenda.",
  }),
  category: z.string().optional().nullable().openapi({
    description: "The category of the event (e.g., 'workshop', 'conference', 'seminar').",
    example: "workshop",
  }),
  venue: z.string().optional().nullable().openapi({
    description: "The location where the event will be held.",
    example: "PUP Main Campus, Sta. Mesa, Manila",
  }),
  start_date: z.string().optional().nullable().openapi({
    description: "The scheduled start date and time for the event.",
  }),
  end_date: z.string().optional().nullable().openapi({
    description: "The scheduled end date and time for the event.",
  }),
  attendance_points: z.number().optional().openapi({
    description: "The number of points awarded to attendees for participating in this event.",
    example: 10,
  }),
});

export const updateDTO = publicEventUpdateSchema.extend({
  title: z.string().optional().openapi({
    description: "Update the title of the event.",
  }),
  description: z.string().optional().nullable().openapi({
    description: "Update the event description.",
  }),
  category: z.string().optional().nullable().openapi({
    description: "Update the event category.",
  }),
  venue: z.string().optional().nullable().openapi({
    description: "Update the event venue.",
  }),
});
