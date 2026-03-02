import { ZodError } from "zod";


export class TypedRestError extends Error {
  constructor(message: string, err: unknown) {
    super("TypedRestError", { cause: err });
    this.name = "TypedRestError";
    this.message = message;
  }
}

export class IncomingRequestValidationError extends TypedRestError {
  public zodError: ZodError | undefined |
   unknown;

  constructor(message: string, err?: ZodError) {
    super("IncomingValidationError", err);
    this.name = "IncomingValidationError";
    this.message = message;
    this.zodError = err;
  }
}

export class ParsingError extends TypedRestError {
  constructor(message: string, err?: unknown) {
    super("ParsingError", err);
    this.name = "ParsingError";
    this.message = message;
  }
}

export class ContractImplementationError extends TypedRestError {
  constructor(message: string, err?: unknown) {
    super("IncomingValidationError", err);
    this.name = "IncomingValidationError";
    this.message = message;
  }
}

export class OutgoingResponseValidationError extends TypedRestError {
  constructor(message: string, err?: unknown) {
    super("OutgoingValidationError", err);
    this.name = "OutgoingValidationError";
    this.message = message;
  }
}
