import { NextFunction, Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
    errors: [
      {
        title: "Not Found",
        detail:
          "We couldn't find the route you requested. Please check the URL and try again.",
      },
    ],
  });
};
