import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

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
