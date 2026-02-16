import {
  DatabaseConnectionError,
  DatabaseError,
  ForeignKeyConstraintError,
  QueryTimeoutError,
  UniqueConstraintError,
} from "@/errors/DatabaseError";
import { PostgrestError } from "@supabase/supabase-js";

export function handlePostgresError(err: PostgrestError): never {
  const code = err.code;
  const message = err.message;

  switch (code) {
    case "23505": // Unique violation
      throw new UniqueConstraintError(`${code}: ${message}`, err);
    case "23503": // Foreign key violation
      throw new ForeignKeyConstraintError(`${code}: ${message}`, err);
    case "57014": // Query timeout
      throw new QueryTimeoutError(`${code}: ${message}`, err);
    case "08001":
    case "08004":
      throw new DatabaseConnectionError("Unable to establish connection", err);
    default:
      throw new DatabaseError(
        "An unexpected database error occurred",
        `${code}: ${message}`,
        err,
      );
  }
}
