import { extend } from "zod/mini";

type ServerErrorProps = {
  statusCode: number;
  status?: "fail" | "error";
  message?: string;
  title?: string;
  detail?: string;
  context?: string[];
};

export class ServerError_DEPRECATED extends Error {
  public statusCode: number;
  public status: "fail" | "error";

  public title: string;
  public detail: string;
  public context: string[];

  constructor({
    statusCode = 500,
    status = "error",
    message = "Internal Server Error",
    title = "Internal Server Error",
    detail = "Internal Server Error",
    context = [],
  }: ServerErrorProps) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = status || `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.title = title;
    this.detail = detail;

    this.context = context || [];

    Error.captureStackTrace(this, this.constructor);
  }

  addContext(context: string) {
    this.context.push(context);
    return this;
  }

  static unauthorized(
    message: string = "You must be logged in to access this resource.",
  ) {
    return new ServerError_DEPRECATED({
      statusCode: 401,
      title: "Unauthenticated",
      message,
    });
  }

  static forbidden(
    message: string = "You do not have permission to perform this action.",
  ) {
    return new ServerError_DEPRECATED({
      statusCode: 403,
      title: "Forbidden",
      message,
    });
  }

  static notFound(message: string = "Resource not found") {
    return new ServerError_DEPRECATED({
      statusCode: 404,
      title: "Not Found",
      message,
    });
  }

  static internalError(message: string) {
    return new ServerError_DEPRECATED({
      statusCode: 500,
      title: "Internal Server Error",
      message,
    });
  }
}

export class ServiceError extends ServerError_DEPRECATED {
  constructor(detail: string = "Service Error") {
    super({ statusCode: 500, title: "Service Error", detail: detail });
  }
}

export class ControllerError extends ServerError_DEPRECATED {
  constructor(detail: string = "Controller Error") {
    super({ statusCode: 500, title: "Controller Error", detail: detail });
  }
}
export class InvalidOperationError extends ServerError_DEPRECATED {
  constructor(detail: string = "Invalid Operation") {
    super({ statusCode: 400, title: "Invalid Operation", detail: detail });
  }
}


export class RepositoryError extends ServerError_DEPRECATED {
  constructor(detail: string = "Repository Error") {
    super({ statusCode: 500, title: "Database Error", detail: detail });
  }
}

export class CantCreateError extends ServerError_DEPRECATED {
  constructor(detail: string = "Cant create resource") {
    super({ statusCode: 500, title: "Cant create resource", detail: detail });
  }
}

