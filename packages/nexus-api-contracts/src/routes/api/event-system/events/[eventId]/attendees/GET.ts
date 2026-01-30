import { attendee } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  user_id: z.string().optional(),
  checkin_method: z.string().optional(),
  is_present: z.coerce.boolean().optional(),
  created_at_gte: z.string().optional(),
  created_at_lte: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(attendee.row),
  ...SchemaFactory.Response.standardErrors(),
};
