import z, { ZodType, ZodError } from "zod";
import {
  ContractError,
  EndpointDef,
  inferContext,
  InferHandlerResult,
  inferOutputFunction,
  inferRequest,
  inferResponse,
  RequestHandler,
} from "#types/contract.types.js";

// --- Controller Factory ---
export const createExpressController = <T extends EndpointDef>(
  schema: T,
  handler: ({
    input,
    ctx,
    output,
  }: {
    input: inferRequest<T>;
    ctx: inferContext<T>;
    output: inferOutputFunction<T>;
  }) => Promise<InferHandlerResult<T>>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { request, response } = schema;

      // -------------------------------------------------
      // 1. INPUT PARSING (Blame Caller)
      // -------------------------------------------------
      // We wrap input parsing to catch ZodErrors and rethrow as Client errors

      let input: any = {};

      try {
        if (request?.query) {
          input.query = await request.query.parseAsync(req.query);
        }
        if (request?.params) {
          input.params = await request.params.parseAsync(req.params);
        }
        if (request?.body) {
          input.body = await request.body.parseAsync(req.body);
        }
      } catch (err) {
        if (err instanceof ZodError) {
          throw new ContractError(err, "client");
        }
        if (err instanceof ContractError) {
          throw new Error(
            "[@packages/contract-gen:src/server/index.ts/createExpressController] an unknown error occured while validating request."
          );
        }
        throw err; // Rethrow unknown errors
      }

      // -------------------------------------------------
      // 2. OUTPUT HELPER
      // -------------------------------------------------
      const output = <S extends keyof T["response"]>(
        status: S,
        body: inferResponse<T>[S]
      ) => {
        return { status, body };
      };

      // -------------------------------------------------
      // 3. EXECUTE HANDLER
      // -------------------------------------------------
      const result = await handler({
        input: input as inferRequest<T>,
        ctx: { req, res },
        output,
      });

      // -------------------------------------------------
      // 4. RESPONSE VALIDATION (Blame Implementer)
      // -------------------------------------------------
      const statusCode = result.status;
      const responseValidator = response[
        statusCode as keyof typeof response
      ] as ZodType | undefined;

      if (responseValidator) {
        try {
          await responseValidator.parseAsync(result.body);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new ContractError(err, "server");
          }
          throw err;
        }
      } else {
        console.warn(
          `[Contract Warning] No response schema defined for status ${statusCode as string}`
        );
      }

      res.status(Number(statusCode)).json(result.body);
    } catch (error) {
      next(error);
    }
  };
};
