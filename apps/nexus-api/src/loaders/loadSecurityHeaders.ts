import { Express } from "express";
import helmet from "helmet";

const baseCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
].join("; ");

const permissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
].join(", ");

export const loadSecurityHeaders = (app: Express) => {
  app.disable("x-powered-by");
  app.use(helmet());

  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", baseCsp);
    res.setHeader("Permissions-Policy", permissionsPolicy);
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=15552000; includeSubDomains; preload",
      );
    }

    next();
  });
};
