import pinoHttp from "pino-http";
import { Request, Response } from "express";

export class LoggerMiddleware {
  constructor() {}

  pino = pinoHttp({
    // Define a custom logger level (optional)
    // 'info' is standard for request logging
    useLevel: "info",

    // Configuration for "Pretty Printing" in local development
    // In production, this will be skipped to keep logs as fast JSON
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard", // Formats timestamp nicely
              ignore: "pid,hostname", // Cleaner output
              messageFormat: "{msg} {req.method} {req.url}", // Custom message format
            },
          }
        : undefined,

    // Customize what information is logged
    serializers: {
      req: (req: Request) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        // query: req.query, // Uncomment if you want query params logged
        // params: req.params,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },

    // Optional: distinct message for success vs error
    customSuccessMessage: (req, res) => {
      return `Request Completed`;
    },
    customErrorMessage: (req, res, err) => {
      return `Request Failed: ${err.message}`;
    },
  });
}


export const loggerMiddleware = new LoggerMiddleware();