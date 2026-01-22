import e from "express";
import z from "zod";

export const insertDTO = z.object({
  eventId: z.string(),
  attendeeId: z.string(),
  checkinMethod: z.enum(["QR_CODE", "MANUAL", "GOOGLE_FORMS", "NFC"]),
});
