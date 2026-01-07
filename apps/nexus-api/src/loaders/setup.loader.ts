import { Express } from "express";
import { loggerMiddleware } from "src/middlewares/logger.middleware.js";
import { rateLimiter } from "src/middlewares/rateLimiter.js";
import cors from "cors";
import { configs } from "src/configs/configs.js";

export const setupLoader = (app: Express) => {
  // CORS config
  app.use(
    cors({
      origin: [configs.clientBaseUrl || ""],
      credentials: true,
    })
  );

  app.use(loggerMiddleware.pino);

  // Rate limiting
  app.use(rateLimiter);
};
