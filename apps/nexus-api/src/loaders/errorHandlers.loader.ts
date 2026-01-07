import { Express } from "express";
import { globalErrorHandler } from "src/middlewares/error.middleware.js";
export const errorHandlerLoader = (app: Express) => {
  app.use(globalErrorHandler);
};
