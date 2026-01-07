import { ServerError } from "../classes/ServerError.js";
import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window (replaced 'max')
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Custom handler to return JSON:API error format
  handler: (req, res, next, options) => {
    return new ServerError(
      options.statusCode,
      "Too Many Requests",
      "You have sent too many requests in a given amount of time. Please try again later."
    );
  },
});
