import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz as z } from "@packages/typed-rest/shared";

export const query = z.object({
  email: z.string().email(),
});

export const response = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      isMember: z.boolean(),
      member: z.any().nullable(),
    }),
  }),
  ...OpenApiSchemas.Response.standardErrors(),
};
