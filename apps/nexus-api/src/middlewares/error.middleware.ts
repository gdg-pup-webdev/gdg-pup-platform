 
import { ServerError } from "@/classes/ServerError.js";
import { ContractError } from "@packages/typed-rest";
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

  if (err instanceof ContractError ) {
    console.error("🚨 CONTRACT VIOLATION 🚨", {
      path: req.path,
      method: req.method,
      validationErrors: err.error.issues,
    });

    if (err.blame === "client" ) {

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
    else if (err.blame === "server" ) {

      
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

  if (err instanceof ServerError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: "Internal Server Error",
      errors: [
        {
          title: err.title,
          detail: err.message,
          moreDetails:  "An error occured while " + err.context.join(" while "), 
          // moreDetails: err.context,
        }
      ],
    })
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
