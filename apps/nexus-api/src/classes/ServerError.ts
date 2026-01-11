export class ServerError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public title: string;

  constructor(statusCode: number, title:string, message?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.title = title;
    // Marks this error as something we predicted (e.g., User not found)
    // vs. a programming bug (e.g., ReferenceError)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(
    message: string = "You must be logged in to access this resource."
  ) {
    return new ServerError(401, "Unauthenticated", message);
  }

  static forbidden(
    message: string = "You do not have permission to perform this action."
  ) {
    return new ServerError(403, "Forbidden", message);
  }

  static notFound(message: string = "Resource not found") {
    return new ServerError(404, "Not Found", message);
  }

  static internalError(message: string) {
    return new ServerError(500, "Internal Server Error", message);
  }
}