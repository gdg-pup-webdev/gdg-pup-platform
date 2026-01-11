import {
  ClientRequestValidationError,
  ServerResponseValidationError,
} from "@packages/api-typing";
import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred.";
  let title = err.title || "Error";

  console.error("ERROR", err); // Log the real error for the dev

  if (err instanceof ClientRequestValidationError) {
    return res.status(400).json({
      title: "Bad Request",
      message: `Request validation failed. `,
      errors: err.error.issues.map((issue) => {
        let detail = ``;
        if (issue.code === "invalid_type") {
          detail += ` ${z.prettifyError(err.error)}`;
        } else {
          detail = issue.code;
        }

        return {
          title: issue.message,
          detail: detail,
          // moreDetails: z.treeifyError(err.error),
          path: `${issue.path.join(" -> ")}`,
        };
      }),
    });
  }

  // CASE B: Server broke the contract -> 500
  if (err instanceof ServerResponseValidationError) {
    // Log this CRITICALLY - the backend is broken!
    console.error("🚨 CONTRACT VIOLATION 🚨", {
      path: req.path,
      method: req.method,
      validationErrors: err.error.issues,
    });

    return res.status(500).json({
      title: "Internal Server Error",
      message: "Response validation failed. Contract violated.",
      errors: err.error.issues.map((issue) => {
        let detail = ``;
        if (issue.code === "invalid_type") {
          detail += ` ${z.prettifyError(err.error)}`;
        } else {
          detail = issue.code;
        }

        return {
          title: issue.message,
          detail: detail,
          // moreDetails: z.treeifyError(err.error),
          path: `${issue.path.join(" -> ")}`,
        };
      }),
    });
  }

  // 3. Handle Operational Errors (AppError)
  if (err.isOperational) {
    return res.status(statusCode).json({
      errors: [
        {
          status: statusCode.toString(),
          title: title,
          detail: message,
        },
      ],
    });
  }

  // 4. Handle Unknown/Programming Errors (Don't leak details to client)

  return res.status(500).json({
    errors: [
      {
        status: "500",
        title: "Internal Server Error",
        detail: `Something went wrong on our end. ${JSON.stringify(err)}`,
      },
    ],
  });
};
