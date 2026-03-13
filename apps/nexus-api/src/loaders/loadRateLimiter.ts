 
import { Router } from "express";
import { rateLimiter } from "../middlewares/rateLimiter";

export const loadRateLimiter = (router: Router) => {
  // Rate limiting
  router.use(rateLimiter);
};
