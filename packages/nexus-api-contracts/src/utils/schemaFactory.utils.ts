import { z } from "zod";

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

    export const list = <T extends z.ZodTypeAny>(dataSchema: T) => {
      return z.object({
        status: z.string(),
        message: z.string(),
        data: dataSchema.array(),
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
              moreDetails: z.unknown().optional(),
              source: z.string().optional(),
            })
          )
          .optional(),
      });
    };

    /**
     * - 400 Bad Request
     * - 403 Forbidden
     * - 500 Internal Server Error
     */
    export const standardErrors = () => {
      return {
        400: SchemaFactory.Response.error(),
        403: SchemaFactory.Response.error(),
        404: SchemaFactory.Response.error(),
        500: SchemaFactory.Response.error(),
      };
    };
  }

  export namespace Request {
    export namespace Paginated {
      export const query = () => {
        return z.object({
          page: z
            .object({
              number: z.coerce.number().int().positive().default(1),
              size: z.coerce.number().int().positive().default(10),
            })
            .default({ number: 1, size: 10 }), // 👈 THIS IS THE MAGIC FIX
        });
      };
    }

    export const withPayload = <T extends z.ZodTypeAny>(dataSchema: T) => {
      return z.object({
        data: dataSchema,
      });
    };
  }
}
