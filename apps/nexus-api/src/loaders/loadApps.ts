import { catchAllErrorsMiddleware } from "@/middlewares/catchAllErrors.middleware";
import { createDeprecatedRouteMiddleware } from "@/middlewares/deprecatedRoute.middleware";
import { notFoundMiddleware } from "@/middlewares/notFound.middleware";
import { createUnstableRouteMiddleware } from "@/middlewares/unstableRouteMiddleware";
import { Version0 } from "@/v0";
import { Version1 } from "@/v1";
import { Express } from "express";

export const loadApps = (app: Express) => {
  const deprecatedWarningMiddleware = createDeprecatedRouteMiddleware("v1");
  // const unstableWarningMiddleware = createUnstableRouteMiddleware("v1");

  const version0 = new Version0();
  const version1 = new Version1();

  app.use("/api/v1", version1.app);

  app.use("/api/v0", deprecatedWarningMiddleware, version0.app);
  app.use("/api", deprecatedWarningMiddleware, version0.app);

  app.use("/", notFoundMiddleware);

  app.use(catchAllErrorsMiddleware);
};
