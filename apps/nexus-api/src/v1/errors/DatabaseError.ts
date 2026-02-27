import { ServerError } from "./ServerError";

export class DatabaseError extends ServerError {
  override name = "DatabaseError";
  constructor(title: string, detail: string, originalError?: unknown) {
    super(title, detail, originalError);
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(
    detail: string = "Failed to connect to the database",
    err?: unknown,
  ) {
    super("Database Connection Error", detail, err);
  }
}

export class QueryTimeoutError extends DatabaseError {
  constructor(
    detail: string = "The database query took too long to execute",
    err?: unknown,
  ) {
    super("Query Timeout Error", detail, err);
  }
}

export class ConstraintViolationError extends DatabaseError {
  constructor(detail: string, err?: unknown) {
    super("Constraint Violation", detail, err);
  }
}

// More specific constraint errors can inherit from the one above
export class UniqueConstraintError extends ConstraintViolationError {
  constructor(
    detail: string = "A record with this value already exists",
    err?: unknown,
  ) {
    super(detail, err);
  }
}

export class ForeignKeyConstraintError extends ConstraintViolationError {
  constructor(
    detail: string = "Related record not found or still in use",
    err?: unknown,
  ) {
    super(detail, err);
  }
}

export class DeadlockError extends DatabaseError {
  constructor(detail: string = "Database deadlock detected", err?: unknown) {
    super("Transaction Deadlock", detail, err);
  }
}

export class MigrationError extends DatabaseError {
  constructor(detail: string, err?: unknown) {
    super("Database Migration Error", detail, err);
  }
}
