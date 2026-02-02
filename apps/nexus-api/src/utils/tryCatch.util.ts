import { ServerError } from "@/classes/ServerError.js";

export type SyncResult<T, E = Error> =
  | { data: T; error: undefined }
  | { data: undefined; error: E };

export type AsyncResult<T, E = Error> = Promise<SyncResult<T, E>>;

/**
 * Error handling utility the converts throwed errors into returned variables
 * - Takes a function
 * - Runs the function
 * - Return the result if successful
 * - Return the error on error
 */
export const _tryCatch = async <T>(fn: () => Promise<T>): AsyncResult<T> => {
  try {
    const data = await fn();
    return { data, error: undefined };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error, data: undefined };
  }
};

/**
 * Extends the tryCatch utility by adding custom error handlers
 * - converts errors into returned variables
 * - takes a function and optional error handlers
 * - runs the error handlers on error and returns their result instead
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
  context: string,
): AsyncResult<T> => {
  const { data, error } = await _tryCatch(fn);

  if (error) {
    if (error instanceof ServerError) {
      error.addContext(context);

      throw error;
    }

    // handle other error types here if needed
    // ...
    // ...

    // unknown errors. let the caller handle it
    return { error, data: undefined };
  }

  // no error
  return { data, error: undefined };
};

export const tryCatchHandled = async <T>(
  fn: () => Promise<T>,
  handlers?: {
    onServerError?: (error: ServerError) => void;
  },
): AsyncResult<T> => {
  const { data, error } = await _tryCatch(fn);

  if (error) {
    if (error instanceof ServerError) {
      if (handlers?.onServerError) handlers.onServerError(error);
    }

    // handle other error types here if needed
    // ...
    // ...

    return { error, data: undefined };
  }

  return { data, error: undefined };
};

/**
 * Utility builder function to rethrow ServerErrors with added context.
 * - This function returns a function
 * - The function takes a ServerError, adds context to it, and rethrows it.
 */
export const handleServerError = <T extends ServerError>(context: string) => {
  return (error: T) => {
    console.log("Rethrowing ServerError with context:", error, context);
    error.addContext(context);
    throw error;
  };
};

/**
 * Utility function to assert the type of result
 */
export function assertResult<T, E>(
  result: SyncResult<T, E>,
): asserts result is { data: T; error: undefined } {
  if (result.error) {
    // If it's a ServerError, we can add context here if we wanted
    throw result.error;
  }
  if (result.data === undefined) {
    throw new Error("Data is unexpectedly undefined");
  }
}

// export const tryCatchHandled = async <T>(
//   fn: () => Promise<T>,
//   handlers?: {
//     onServerError?: (error: ServerError) => GoLikeResult<T>;
//     onError?: (error: Error) => GoLikeResult<T>;
//     onUnknownError?: (error: unknown) => GoLikeResult<T>;
//   },
// ): Promise<GoLikeResult<T>> => {
//   const result = await tryCatch(fn);

//   if (result.error) {
//     const err = result.error; // Capture for narrowing

//     if (err instanceof ServerError) {
//       if (handlers?.onServerError) return handlers.onServerError(err);
//       return { error: err, data: null };
//     }

//     if (err instanceof Error) {
//       if (handlers?.onError) return handlers.onError(err);
//       return { error: err, data: null };
//     }

//     if (handlers?.onUnknownError) return handlers.onUnknownError(err);
//     return { error: err, data: null };
//   }

//   return result as { data: T; error: null};
// };
