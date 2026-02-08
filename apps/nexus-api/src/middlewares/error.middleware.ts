import { ServerError_DEPRECATED } from "@/classes/ServerError.js";
import { HttpError } from "@/errors/HttpError";
import { ServerError } from "@/errors/ServerError";
import { ContractError } from "@packages/typed-rest";
import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred.";
  let title = err.title || "Error";

  console.log("///////////////////////////////////");
  console.error(err);
  console.log("///////////////////////////////////");

  if (err instanceof ContractError) {
    if (err.blame === "client") {
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
    } else if (err.blame === "server") {
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
  }

  if (err instanceof ServerError_DEPRECATED) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: [
        {
          title: err.title,
          detail: err.detail,
          moreDetails: {
            context: err.context.reverse().join(" -> "),
          },
        },
      ],
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: "HTTP Error",
      errors: [
        {
          title: err.title,
          detail: err.detail,
          moreDetails: {
            stack: err.stack,
            chain: err.getErrorChain(),
            name: err.name,
          },
        },
      ],
    });
  }

  if (err instanceof ServerError) {
    return res.status(500).json({
      errors: [
        {
          status: "error",
          title: "Internal Server Error",
          errors: [
            {
              title: err.title,
              detail: err.detail,
              moreDetails: {
                stack: err.stack,
                chain: err.getErrorChain(),
                name: err.name,
              },
            },
          ],
        },
      ],
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      errors: [
        {
          status: "error",
          title: "Unhandled Error",
          errors: [
            {
              title: err.name,
              detail: err.message,
              moreDetails: {
                stack: err.stack,
              },
            },
          ],
        },
      ],
    });
  }
  
  return res.status(500).json({
    errors: [
      {
        status: "error",
        title: "Unknown Error",
        errors: [
          {
            title: "Unknown",
            detail: "No details.",
          },
        ],
      },
    ],
  });
};
