import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, trustProxy: false },

  // Custom handler to return JSON:API error format
  handler: (req, res, next, options) => {
    return res.status(429).json({
      status: "error",
      message: "Too Many Requests",
      errors: [
        {
          title: "Too Many Requests",
          detail: "You have sent too many requests in a given amount of time.",
        },
      ],
    });
  },
});
