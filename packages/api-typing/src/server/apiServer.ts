import { Request, RequestHandler, Response } from "express";
import z, { ZodType } from "zod";
import { EndpointType } from "../types/contract.types.js";
import { InferHandlerResult, InferRequestInput, ResponseSchemaOf } from "../types/enforcer.type.js";
     
export const createExpressController = <T extends EndpointType>(
  schema: T,
  handler: ({
    input,
    output,
    res,
    req,
  }: {
    input: InferRequestInput<T>;
    output: <S extends keyof T["response"]>(
      status: S,
      body: ResponseSchemaOf<T, S>
    ) => { status: S; body: ResponseSchemaOf<T, S> };
    res: Response;
    req: Request;
  }) => Promise<InferHandlerResult<T>>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { request, response } = schema;

      const input = {} as InferRequestInput<T>;

      if (request.query) {
        console.log("Parsing query", req.query, JSON.stringify(req.query));
        (input as any).query = await request.query.parseAsync(req.query);
      }

      if (request.params) {
        (input as any).params = await request.params.parseAsync(req.params);
      }

      if (request.body) {
        (input as any).body = await request.body.parseAsync(req.body);
      }

      const output = <S extends keyof T["response"]>(
        status: S,
        body: ResponseSchemaOf<T, S>
      ) => {
        return { status, body } as const;
      };

      const result = await handler({ input, output, req, res });

      const statusCode = result.status;
      const responseSchema = (response as any)[statusCode];

      if (responseSchema) {
        await responseSchema.parseAsync(result.body);
      }

      res.status(Number(statusCode)).json(result.body);
    } catch (error) {
      next(error);
    }
  };
};
