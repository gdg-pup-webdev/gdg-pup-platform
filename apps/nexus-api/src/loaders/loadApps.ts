import { catchAllErrorsMiddleware } from "@/middlewares/catchAllErrors.middleware";
import { notFoundMiddleware } from "@/middlewares/notFound.middleware";
import { createDeprecatedRoute } from "@/middlewares/createDeprecatedRoute.middleware";
import { Version1 } from "@/v1";
import { Express, Request, Response, NextFunction } from "express";

export const loadApps = (app: Express) => {
  const version1 = new Version1();

  app.use("/api/v1", version1.app);

  let version0App: any = null;
  const lazyLoadV0 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!version0App) {
        const { Version0 } = await import("@/v0/index.js");
        version0App = new Version0().app;
      }
      return version0App(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  app.use("/api/v0", createDeprecatedRoute(lazyLoadV0, "v1"));
  app.use("/api", createDeprecatedRoute(lazyLoadV0, "v1"));

  app.use("/", notFoundMiddleware);

  app.use(catchAllErrorsMiddleware);
};
