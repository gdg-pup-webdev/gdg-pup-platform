import { extend } from "zod/mini";

/**
 *  export const error = () => {
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
 */

type ServerErrorProps = {
  statusCode: number;
  status?: "fail" | "error";
  message?: string;
  title?: string;
  detail?: string;
  context?: string[];
};

export class ServerError extends Error {
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
    return new ServerError({
      statusCode: 401,
      title: "Unauthenticated",
      message,
    });
  }

  static forbidden(
    message: string = "You do not have permission to perform this action.",
  ) {
    return new ServerError({
      statusCode: 403,
      title: "Forbidden",
      message,
    });
  }

  static notFound(message: string = "Resource not found") {
    return new ServerError({
      statusCode: 404,
      title: "Not Found",
      message,
    });
  }

  static internalError(message: string) {
    return new ServerError({
      statusCode: 500,
      title: "Internal Server Error",
      message,
    });
  }
}

type LayerErrorProps = ServerErrorProps & { layerName: string };
export class LayerError extends ServerError {
  public layerName: string;
  constructor({ layerName, ...props }: LayerErrorProps) {
    super(props);
    this.layerName = layerName;
  }
}

export class RepositoryError extends LayerError {
  constructor(
    repository: string,
    tableName: string,
    detail: string,
    context: string,
  ) {
    super({
      layerName: "repository",
      statusCode: 500,
      title: `Database Error on repostory: ${repository} table: ${tableName}`,
      detail: detail,
      context: [context],
    });
  }
}

export class ServiceError extends LayerError {
  constructor(serviceName: string, detail: string, context: string) {
    super({
      layerName: "service",
      statusCode: 500,
      title: `Service Error on ${serviceName}`,
      message: detail,
      context: [context],
    });
  }
}

export class ControllerError extends LayerError {
  constructor(controllerName: string, detail: string, context: string) {
    super({
      layerName: "controller",
      statusCode: 500,
      title: `Controller Error on ${controllerName}`,
      message: detail,
      context: [context],
    });
  }
}
