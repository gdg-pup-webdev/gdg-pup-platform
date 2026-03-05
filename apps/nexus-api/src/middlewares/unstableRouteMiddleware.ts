import { NextFunction, Request, Response } from "express";

export const createUnstableRouteMiddleware = (latestStableVersion: string) => {
  return function unstableWarningInterceptor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      const { warnings, ...rest } = body;

      let warningArray = warnings;
      if (warningArray && !Array.isArray(warningArray)) {
        warningArray = [warningArray];
      }

      const myWarning = {
        type: "Unstable Route Warning",
        message:
          "This route is unstable and is subject to change. Please use the latest stable version of the API.",
        latest_stable_version: latestStableVersion,
      };

      return originalJson({
        warnings: [...(warningArray || []), myWarning],
        ...rest,
      });
    };

    next();
  };
};
