import { Express } from "express";
import cors from "cors";
import { configs } from "@/configs/configs";

export const loadCors = (app: Express) => {
  // Trust the first proxy (Cloud Run / load balancer)
  app.set("trust proxy", 1);

  const allowedOrigins = new Set<string>([
    "http://localhost:3000",
    "http://localhost:3100",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3100",
  ]);

  // CLIENT_URL supports comma-separated origins, e.g.:
  //   https://dev.gdgpup.org,https://admin.dev.gdgpup.org
  if (configs.clientBaseUrl) {
    for (const url of configs.clientBaseUrl.split(",")) {
      const trimmed = url.trim();
      if (trimmed) allowedOrigins.add(trimmed);
    }
  }

  // Allow local network testing only during development.
  const localNetworkOriginPattern =
    /^http:\/\/(?:192\.168(?:\.\d{1,3}){2}|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?::\d+)?$/;

  // CORS config
  app.use(
    cors({
      origin: (origin, callback) => {
        // Requests without Origin (curl/Postman/server-to-server) should pass.
        if (!origin) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        if (configs.devMode && localNetworkOriginPattern.test(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
    }),
  );
};
