import { Express } from "express";
import { loggerMiddleware } from "@/middlewares/logger.middleware.js";
import { rateLimiter } from "@/middlewares/rateLimiter.js";
import { configs } from "@/configs/configs.js";
import cors from "cors";

export const setupLoader = (app: Express) => {
  // Trust the first proxy (Cloud Run / load balancer)
  app.set("trust proxy", 1);

  // CORS config
  // CLIENT_URL supports comma-separated origins, e.g.:
  //   https://dev.gdgpup.org,https://admin.dev.gdgpup.org
  const allowedOrigins = (configs.clientBaseUrl || "http://localhost:3000|http://localhost:3100")
    .split(/[,|]/)
    .map((u) => u.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(loggerMiddleware.pino);

  // Rate limiting
  app.use(rateLimiter);
};
