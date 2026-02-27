 
import { TooManyRequestError } from "@/v1/errors/HttpError";
import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window (replaced 'max')
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip express-rate-limit's proxy header validations.
  // Cloud Run always sits behind Google's load balancer which sets
  // X-Forwarded-For and Forwarded headers. We handle this via
  // Express's "trust proxy" setting in setup.loader.ts instead.
  validate: { xForwardedForHeader: false, trustProxy: false },

  // Custom handler to return JSON:API error format
  handler: (req, res, next, options) => {
    throw new TooManyRequestError(
      "You have sent too many requests in a given amount of time. Please try again later.",
    );
  },
});
