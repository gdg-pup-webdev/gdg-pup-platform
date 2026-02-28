import { NextFunction, Request, Response } from "express";

export const deprecatedRouteMiddleware = (latestVersion: string) => {
  return function deprecatedWarningInterceptor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const cleanPath = req.originalUrl
      .replace(/^\/?api\//, "") // Remove leading api/
      .replace(/^v\d+\//, "") // Remove leading v1/, v2/, etc.
      .replace(/\/+$/, ""); // Remove trailing slashes

    // const recommendedUrl = `${req.protocol}://${req.get("host")}/api/${latestVersion}/${cleanPath}`;

    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      const { deprecation_warning, ...rest } = body;

      const warningField = {
        type: "Deprecation Warning",
        message:
          "This endpoint has been deprecated and will be removed in the future. Please use the latest version of the API.",
        latest_version: latestVersion,
        // recommended_endpoint: recommendedUrl, // Added the dynamic suggestion here
      };

      return originalJson({
        ...(deprecation_warning
          ? { deprecation_warning_override: warningField, ...deprecation_warning }
          : { deprecation_warning: warningField }),
        ...rest,
      });
    };

    next();
  };
};
