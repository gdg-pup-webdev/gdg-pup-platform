import { ServerError } from "@/classes/ServerError.js";

export type SyncResult<T = any, E = any> =
  | { data: T; error: null }
  | { data: null; error: E };

export type AsyncResult<T = any, E = any> = Promise<SyncResult<T, E>>;

/**
 * Error handling utility the converts throwed errors into returned variables
 * - Takes a function
 * - Runs the function
 * - Return the result if successful
 * - Return the error on error
 */
export const tryCatch = async <T>(fn: () => Promise<T>): AsyncResult<T> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    return { error, data: null };
  }
};

/**
 * Extends the tryCatch utility by adding custom error handlers
 * - takes a function and optional error handlers
 * - runs the error handlers on error and returns their result instead
 */
export const tryCatchHandled = async <T>(
  fn: () => Promise<T>,
  handlers?: {
    onServerError?: (error: ServerError) => void;
  },
): AsyncResult<T> => {
  const { data, error } = await tryCatch(fn);

  if (error) {
    const err = error;

    if (err instanceof ServerError) {
      if (handlers?.onServerError) handlers.onServerError(err);
    }

    // handle other error types here if needed
    // ...
    // ...

    return { error: err, data: null };
  }

  return { data: data as T, error: null };
};

/**
 * Utility builder function to rethrow ServerErrors with added context.
 * - This function returns a function
 * - The function takes a ServerError, adds context to it, and rethrows it.
 */
export const rethrowServerError = <T extends ServerError>(context: string) => {
  return (error: T) => {
    error.addContext(context);
    throw error;
  };
};

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
