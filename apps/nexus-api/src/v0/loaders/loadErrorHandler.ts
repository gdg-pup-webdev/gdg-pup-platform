 import { Router } from "express";
import { globalErrorHandler } from "../middlewares/error.middleware";

export const loadErrorHandler = (router: Router) => {
  router.use(globalErrorHandler);
};
