import { NextFunction, Request, Response, Router } from "express";

export const createUnstableRoute = (
  router: Router | any, // Can be Express App or Router
  latestStableVersion: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      const safeBody =
        typeof body === "object" && body !== null && !Array.isArray(body)
          ? body
          : {};
      const { warnings, ...rest } = safeBody;

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

      let finalBody;

      // Handle primitives or arrays gracefully
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        finalBody = {
          warnings: [myWarning],
          data: body,
        };
      } else {
        finalBody = {
          warnings: [...(warningArray || []), myWarning],
          ...rest,
        };
      }

      // 3. Send the modified body using the original res.json
      return originalJson(finalBody);
    };

    router(req, res, (err?: any) => {
      res.json = originalJson;

      next(err);
    });
  };
};
