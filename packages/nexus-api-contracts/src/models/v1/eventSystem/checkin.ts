/**
 * @file checkin.ts
 * @description Zod model definitions for Event Check-in.
 */

import { cz as z } from "@packages/typed-rest/shared";

/** Data Transfer Object for creating an event check-in. */
export const checkinInsertDTO = z.object({
  attendeeId: z.string(),
  checkinMethod: z.enum(["QR_CODE", "MANUAL", "GOOGLE_FORMS", "NFC"]),
});
