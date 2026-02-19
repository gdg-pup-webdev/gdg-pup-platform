import { cz } from "#shared/cz.js";

export namespace OpenApiSchemas {
  export namespace Models {
    export const file = () => {
      return cz.file().openapi({
        type: "string",
        format: "binary",
      });
    };

    export const files = () => {
      return cz.array(file());
    };
  }

  export namespace Response {
    export const empty = () => {
      return cz.object({
        status: cz.string(),
        message: cz.string(),
      });
    };

    export const single = <T extends cz.ZodTypeAny>(dataSchema: T) => {
      return cz.object({
        status: cz.string(),
        message: cz.string(),
        data: dataSchema,
      });
    };

    export const list = <T extends cz.ZodTypeAny>(dataSchema: T) => {
      return cz.object({
        status: cz.string(),
        message: cz.string(),
        data: dataSchema.array(),
      });
    };

    export const paginated = <T extends cz.ZodTypeAny>(dataSchema: T) => {
      return cz.object({
        status: cz.string(),
        message: cz.string(),
        data: dataSchema.array(),
        meta: cz.object({
          totalRecords: cz.number(),
          pageSize: cz.number(),
          currentPage: cz.number(),
          totalPages: cz.number(),
        }),
      });
    };

    export const error = () => {
      return cz.object({
        status: cz.string(),
        message: cz.string(),
        errors: cz
          .array(
            cz.object({
              title: cz.string(),
              detail: cz.string(),
              moreDetails: cz.unknown().optional(),
              source: cz.string().optional(),
            }),
          )
          .optional(),
      });
    };

    export const standardErrors = () => {
      return {
        400: OpenApiSchemas.Response.error(),
        403: OpenApiSchemas.Response.error(),
        404: OpenApiSchemas.Response.error(),
        500: OpenApiSchemas.Response.error(),
      };
    };
  }

  export namespace Request {
    export namespace Query {
      export const paginated = () => {
        return cz.object({
          pageNumber: cz.coerce.number().int().positive().default(1).optional(),
          pageSize: cz.coerce.number().int().positive().default(10).optional(),
        });
      };
    }

    export namespace Body {
      export const withPayload = <T extends cz.ZodTypeAny>(dataSchema: T) => {
        return cz.object({
          data: dataSchema,
        });
      };
    }
  }
}
