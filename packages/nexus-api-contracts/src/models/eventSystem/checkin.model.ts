import e from "express";
import z from "zod";

export namespace CheckinModels {
  export const insertDTO = z.object({
    eventId: z.string(),
    attendeeId: z.string(),
    checkinMethod: z.string(),
  });
}
