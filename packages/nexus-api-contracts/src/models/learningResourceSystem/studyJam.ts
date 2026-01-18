import z from "zod";

export const row = z.object({
  // event data
  id: z.string(),
  createdAt: z.string(),
  title: z.string(),
  description: z.string(),
  recordingLink: z.string(),
  summary: z.string(),
  teamId: z.string(),
});

export const insert = row.omit({ id: true, createdAt: true });

export const update = insert.partial();
