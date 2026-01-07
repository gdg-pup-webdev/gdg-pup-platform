import z from "zod";

export namespace SchemaFactory {
  export namespace Response {
    export const empty = () => {
      return z.object({
        status: z.string(),
        message: z.string(),
      });
    };

    export const single = <T extends z.ZodTypeAny>(dataSchema: T) => {
      return z.object({
        status: z.string(),
        message: z.string(),
        data: dataSchema,
      });
    };

    export const paginated = <T extends z.ZodTypeAny>(dataSchema: T) => {
      return z.object({
        status: z.string(),
        message: z.string(),
        data: dataSchema.array(),
        meta: z.object({
          totalRecords: z.number(),
          pageSize: z.number(),
          currentPage: z.number(),
          totalPages: z.number(),
        }),
      });
    };

    export const error = () => {
      return z.object({
        status: z.string(),
        message: z.string(),
        errors: z
          .array(
            z.object({
              title: z.string(),
              detail: z.string(),
              source: z.string().optional(),
            })
          )
          .optional(),
      });
    };
  }

  export namespace Request {
    export namespace Paginated {
      export const query = () => {
        return z.object({
          page: z.object({
            number: z.coerce.number().int().positive(),
            size: z.coerce.number().int().positive(),
          }),
        });
      };
    }
  }
}
