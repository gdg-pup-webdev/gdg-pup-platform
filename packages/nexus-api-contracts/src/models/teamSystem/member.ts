import z from "zod";

export const row = z.object({
  id: z.string(),
  role: z.string(),
});

export const insert = row;