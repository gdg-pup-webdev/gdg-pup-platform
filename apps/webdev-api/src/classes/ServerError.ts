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
}