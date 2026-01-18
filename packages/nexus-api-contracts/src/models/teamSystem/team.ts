import { z } from "zod"; 

export const team = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
});

export const teamInsertDTO = team.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const teamUpdateDTO = teamInsertDTO.partial();



