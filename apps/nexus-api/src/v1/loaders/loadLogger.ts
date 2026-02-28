 import { Router } from "express";
import { loggerMiddleware } from "../middlewares/logger.middleware";

export const loadLogger = (router: Router) => {
  // logger
  router.use(loggerMiddleware.pino);
};
