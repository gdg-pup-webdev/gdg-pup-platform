import { catchAllErrorsMiddleware } from "@/middlewares/catchAllErrors.middleware";
import { notFoundMiddleware } from "@/middlewares/notFound.middleware";
import { createDeprecatedRoute } from "@/middlewares/createDeprecatedRoute.middleware";
import { Version0 } from "@/v0";
import { Version1 } from "@/v1";
import { Express } from "express";

export const loadApps = (app: Express) => {
  const version0 = new Version0();
  const version1 = new Version1();

  app.use("/api/v1", version1.app);

  app.use("/api/v0", createDeprecatedRoute(version0.app, "v1"));
  app.use("/api", createDeprecatedRoute(version0.app, "v1"));

  app.use("/", notFoundMiddleware);

  app.use(catchAllErrorsMiddleware);
};
