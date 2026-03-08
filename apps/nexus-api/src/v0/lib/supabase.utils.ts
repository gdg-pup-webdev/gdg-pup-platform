import {
  DatabaseConnectionError,
  DatabaseError,
  ForeignKeyConstraintError,
  QueryTimeoutError,
  UniqueConstraintError,
} from "@/v0/errors/DatabaseError";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * @deprecated This utility is part of the v0 legacy API and will not be maintained.
 * Use the v1 equivalent instead.
 */
export function handlePostgresError(err: PostgrestError): never {
  const code = err.code;
  const message = err.message;

  // @deprecated - instanceof check was unreliable since Supabase returns plain objects, not class instances
  // if (!(err instanceof PostgrestError))
  //   throw new DatabaseError(
  //     "An unknown error has been passed to handlePostgresError. ",
  //     "Expected PostgrestError. Passed unknown error.",
  //     { cause: err },
  //   );

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
