import { ZodError } from "zod";


export class CrestError extends Error {
  constructor(message: string, err: unknown) {
    super("CrestError", { cause: err });
    this.name = "CrestError";
    this.message = message;
  }
}

export class IncomingRequestValidationError extends CrestError {
  public zodError: ZodError | undefined |
   unknown;

  constructor(message: string, err?: ZodError) {
    super("IncomingValidationError", err);
    this.name = "IncomingValidationError";
    this.message = message;
    this.zodError = err;
  }
}

export class ParsingError extends CrestError {
  constructor(message: string, err?: unknown) {
    super("ParsingError", err);
    this.name = "ParsingError";
    this.message = message;
  }
}

export class ContractImplementationError extends CrestError {
  constructor(message: string, err?: unknown) {
    super("IncomingValidationError", err);
    this.name = "IncomingValidationError";
    this.message = message;
  }
}

export class OutgoingResponseValidationError extends CrestError {
  constructor(message: string, err?: unknown) {
    super("OutgoingValidationError", err);
    this.name = "OutgoingValidationError";
    this.message = message;
  }
}
