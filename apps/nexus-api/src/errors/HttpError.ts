import { ServerError } from "./ServerError";

export class HttpError extends ServerError {
  override name = "HttpError";
  constructor(
    public statusCode: number,
    title: string,
    detail: string,
    originalError?: unknown,
  ) {
    super(title, detail, originalError);
  }
}

// 400 - Bad Request
export class BadRequestError extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(400, "Bad Request", detail, err);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends HttpError {
  constructor(detail: string = "Authentication required", err?: unknown) {
    super(401, "Unauthorized", detail, err);
  }
}

// 403 - Forbidden
export class ForbiddenError extends HttpError {
  constructor(detail: string = "Access denied", err?: unknown) {
    super(403, "Forbidden", detail, err);
  }
}

// 404 - Not Found
export class NotFoundError extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(404, "Not Found", detail, err);
  }
}

// 409 - Conflict
export class ConflictError extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(409, "Duplicate Resource", detail, err);
  }
}

// 422 - Unprocessable Entity (Validation)
export class ValidationError extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(422, "Validation Error", detail, err);
  }
}

// 429 - Too Many Requests
export class TooManyRequestError extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(429, "Too Many Requests", detail, err);
  }
}

// 500 - Internal Errors
/**
 * @deprecated
 */
export class DatabaseError_DONT_USE extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(500, "Database Error", detail, err);
  }
}

/**
 * @deprecated
 */
export class ServiceError_DONT_USE extends HttpError {
  constructor(detail: string, err?: unknown) {
    super(500, "Service Error", detail, err);
  }
}

/**
 * @deprecated
 */
export class InternalServerError_DONT_USE extends HttpError {
  constructor(detail: string = "An unexpected error occurred", err?: unknown) {
    super(500, "Internal Server Error", detail, err);
  }
}
