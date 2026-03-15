import { PostgrestError } from "@supabase/supabase-js";
import { DatabaseError, UniqueConstraintError, ForeignKeyConstraintError, QueryTimeoutError, DatabaseConnectionError } from "../errors/DatabaseError";

function isPostgrestLike(err: unknown): err is Pick<PostgrestError, "code" | "message"> {
  return Boolean(
    err &&
      typeof err === "object" &&
      "code" in err &&
      "message" in err &&
      typeof (err as { code: unknown }).code === "string" &&
      typeof (err as { message: unknown }).message === "string",
  );
}

export function handlePostgresError(err: unknown): never {
  if (!isPostgrestLike(err)) {
    throw new DatabaseError(
      "An unknown error has been passed to handlePostgresError. ",
      "Expected PostgrestError. Passed unknown error.",
      { cause: err },
    );
  }

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
