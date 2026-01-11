import { Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";  
import { EndpointDef } from "@/types/contract.types.js";
import { InferRequestInput, ResponseSchemaOf, InferHandlerResult } from "@/types/enforcer.type.js";

export const createExpressController = <T extends EndpointDef>(
  schema: T,
  handler: ({
    input,
    ctx, // Renamed 'req/res' to 'ctx' for cleaner API, or keep separate
    output,
  }: {
    input: InferRequestInput<T>;
    ctx: { req: Request; res: Response }; 
    // The output helper ensures type-safety when returning responses
    output: <S extends keyof T["response"]>(
      status: S,
      body: ResponseSchemaOf<T, S>
    ) => { status: S; body: ResponseSchemaOf<T, S> };
  }) => Promise<InferHandlerResult<T>>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { request, response } = schema;

      // -------------------------------------------------
      // 1. INPUT PARSING (Safe & Strict)
      // -------------------------------------------------
      // We parse fields individually first.
      // If the schema part is missing, the variable remains undefined.
      
      const parsedQuery = request?.query 
        ? await request.query.parseAsync(req.query) 
        : undefined;

      const parsedParams = request?.params 
        ? await request.params.parseAsync(req.params) 
        : undefined;

      const parsedBody = request?.body 
        ? await request.body.parseAsync(req.body) 
        : undefined;

      // Construct the input object. 
      // We cast to InferRequestInput<T> because we know we've validated the parts 
      // that exist in T.
      const input = {
        ...(parsedQuery && { query: parsedQuery }),
        ...(parsedParams && { params: parsedParams }),
        ...(parsedBody && { body: parsedBody }),
      } as InferRequestInput<T>;

      // -------------------------------------------------
      // 2. OUTPUT HELPER
      // -------------------------------------------------
      const output = <S extends keyof T["response"]>(
        status: S,
        body: ResponseSchemaOf<T, S>
      ) => {
        return { status, body };
      };

      // -------------------------------------------------
      // 3. EXECUTE HANDLER
      // -------------------------------------------------
      const result = await handler({ 
        input, 
        ctx: { req, res }, 
        output 
      });

      // -------------------------------------------------
      // 4. RESPONSE VALIDATION (Outgoing Contract Check)
      // -------------------------------------------------
      const statusCode = result.status;
      
      // We must cast the key because statusCode is a number, but keys are specific numbers
      const responseValidator = response[statusCode as keyof typeof response] as ZodType | undefined;

      if (responseValidator) {
        // Enforce that the handler returned data matching the contract
        await responseValidator.parseAsync(result.body);
      } else {
        console.warn(`[Contract Warning] No response schema defined for status ${statusCode as string}`);
      }

      // Send Response
      res.status(Number(statusCode)).json(result.body);

    } catch (error) {
      // Pass validation errors or handler errors to Express error middleware
      next(error);
    }
  };
};