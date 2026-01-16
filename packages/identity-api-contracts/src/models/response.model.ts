import z from "zod";

export const getResponseModel = z.object({
    status: z.string(),
    message: z.string(),
  })