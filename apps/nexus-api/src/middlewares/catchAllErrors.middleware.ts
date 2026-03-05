import { NextFunction, Request, Response } from "express";

export const catchAllErrorsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Error) {
    return res.status(500).json({
      errors: [
        {
          status: "error",
          title: "Unhandled Error",
          details: "We encountered an unhandled error.",
          moreDetails: [
            {
              title: err.name,
              detail: err.message,
              stack: err.stack,
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
            title: "We encountered an error with an unknown type.",
            detail: "No details.",
          },
        ],
      },
    ],
  });
};
