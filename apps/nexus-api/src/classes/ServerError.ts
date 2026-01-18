import { extend } from "zod/mini";

export class ServerError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public title: string;
  public type: string;

  public context: string[] = [];

  constructor(props: {
    statusCode: number;
    title: string;
    message?: string;
    type?: string;
  }) {
    super(props.message);
    this.statusCode = props.statusCode;
    this.status = `${props.statusCode}`.startsWith("4") ? "fail" : "error";
    this.title = props.title;
    // vs. a programming bug (e.g., ReferenceError)
    this.isOperational = true;
    this.type = props.type || "Unknown";

    Error.captureStackTrace(this, this.constructor);
  }

  addContext(context: string) {
    this.context.push(context);
    return this;
  }

  static unauthorized(
    message: string = "You must be logged in to access this resource.",
  ) {
    return new ServerError({
      statusCode: 401,
      title: "Unauthenticated",
      message,
      type: "Unauthorized",
    });
  }

  static forbidden(
    message: string = "You do not have permission to perform this action.",
  ) {
    return new ServerError({
      statusCode: 403,
      title: "Forbidden",
      message,
      type: "Forbidden",
    });
  }

  static notFound(message: string = "Resource not found") {
    return new ServerError({
      statusCode: 404,
      title: "Not Found",
      message,
      type: "NotFound",
    });
  }

  static internalError(message: string) {
    return new ServerError({
      statusCode: 500,
      title: "Internal Server Error",
      message,
      type: "InternalError",
    });
  }
}

export class DatabaseError extends ServerError {
  constructor(
    repository: string,
    tableName: string,
    action: string,
    message: string,
  ) {
    super({
      statusCode: 500,
      title: `Database Error on ${repository}`,
      message: `Failed to ${action} on ${tableName}. ${message ? message : ""}`,
      type: "DatabaseError",
    });
  }
}


export class ServiceError extends ServerError {
  constructor(
    serviceName: string,
    action: string,
    message: string,
  ) {
    super({
      statusCode: 500,
      title: `Service Error on ${serviceName}`,
      message: `Failed to ${action}. ${message ? message : ""}`,
      type: "ServiceError",
    });
  }
}

export class ControllerError extends ServerError {
  constructor(
    controllerName: string,
    action: string,
    message: string,
  ) {
    super({
      statusCode: 500,
      title: `Controller Error on ${controllerName}`,
      message: `Failed to ${action}. ${message ? message : ""}`,
      type: "ControllerError",
    });
  }
}