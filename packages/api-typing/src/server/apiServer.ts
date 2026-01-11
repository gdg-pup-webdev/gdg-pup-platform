import { Request, RequestHandler, Response } from "express";
import { ZodType, ZodError } from "zod";
import { EndpointDef } from "@/types/contract.types.js";
import {
  InferHandlerResult,
  InferRequestInput,
  ResponseSchemaOf,
} from "@/types/enforcer.type.js";

// --- Custom Errors ---

/**
 * Thrown when the INCOMING request (body, query, params) fails validation.
 * BLAME: The Caller (Client)
 * ACTION: Return 400 Bad Request
 */
export class ClientRequestValidationError extends Error {
  constructor(public error: ZodError) {
    super("Request validation failed");
    this.name = "ClientRequestValidationError";
  }
}

/**
 * Thrown when the OUTGOING response fails validation against the contract.
 * BLAME: The Implementer (Server Dev)
 * ACTION: Return 500 Internal Server Error (and log immediately)
 */
export class ServerResponseValidationError extends Error {
  constructor(public error: ZodError) {
    super("Server response validation failed (Contract Violation)");
    this.name = "ServerResponseValidationError";
  }
}

// --- Controller Factory ---

/**
 * EXAMPLE USAGE:
   getUserById: RequestHandler = createExpressController(
    Contract.userSystem.users.user.get, // pass the contract schema here
    async ({ input, output, ctx }) => {
      const userId = input.params.userId; // safely typed input object
      const { data, error } = await this.userService.getUserById(userId);
      if (error) {
        throw new ServerError(400, "Bad Request", error.message);
      }
      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    }
  );
 */
export const createExpressController = <T extends EndpointDef>(
  schema: T,
  handler: ({
    input,
    ctx,
    output,
  }: {
    input: InferRequestInput<T>;
    ctx: { req: Request; res: Response };
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
          throw new ClientRequestValidationError(err);
        }
        throw err; // Rethrow unknown errors
      }

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
        input: input as InferRequestInput<T>,
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
            throw new ServerResponseValidationError(err);
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
