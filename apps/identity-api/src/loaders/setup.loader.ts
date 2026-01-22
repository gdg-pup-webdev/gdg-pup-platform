import { Express } from "express";
import { loggerMiddleware } from "@/middlewares/logger.middleware.js";
import { rateLimiter } from "@/middlewares/rateLimiter.js";
import { configs } from "@/configs/configs.js";
import cors from "cors";

export const setupLoader = (app: Express) => {
  // CORS config
  app.use(
    cors({
      origin: [configs.clientBaseUrl || "http://localhost:3000"],
      credentials: true,
    }),
  );

  app.use(loggerMiddleware.pino);

  // Rate limiting
  app.use(rateLimiter);
};
