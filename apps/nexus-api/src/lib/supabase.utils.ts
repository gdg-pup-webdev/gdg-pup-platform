import { DatabaseConnectionError, DatabaseError, ForeignKeyConstraintError, QueryTimeoutError, UniqueConstraintError } from "@/errors/DatabaseError";

export function handlePostgresError(err: any): never {
  const code = err?.code;
  const message = err?.message || "Unknown DB Error";

  switch (code) {
    case "23505": // Unique violation
      throw new UniqueConstraintError(message, err);
    case "23503": // Foreign key violation
      throw new ForeignKeyConstraintError(message, err);
    case "57014": // Query timeout
      throw new QueryTimeoutError(message, err);
    case "08001":
    case "08004":
      throw new DatabaseConnectionError("Unable to establish connection", err);
    default:
      throw new DatabaseError(
        "An unexpected database error occurred",
        message,
        err,
      );
  }
}
