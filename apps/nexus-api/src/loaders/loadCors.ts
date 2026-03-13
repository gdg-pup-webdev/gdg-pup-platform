import { Express } from "express";
import cors from "cors";
import { configs } from "@/configs/configs";

export const loadCors = (app: Express) => {
  // Trust the first proxy (Cloud Run / load balancer)
  app.set("trust proxy", 1);

  // CORS config
  app.use(
    cors({
      origin: [configs.clientBaseUrl || "http://localhost:3000"],
      credentials: true,
    }),
  );
};
