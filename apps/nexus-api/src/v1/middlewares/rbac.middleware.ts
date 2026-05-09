import { RequestHandler } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/HttpError";
import { configs } from "@/configs/configs";

export const requirePermissions = (
  requiredPermissions: Record<string, string[]>,
): RequestHandler => {
  return async (req, res, next) => {
    if (configs.security.disabled) return next();

    // Bypass RBAC if a valid service API key is provided
    if (
      configs.security.serviceApiKey &&
      req.headers["x-service-api-key"] === configs.security.serviceApiKey
    ) {
      return next();
    }

    const user = req.decodedToken;
    if (!user) {
      throw new UnauthorizedError(
        "Authentication required. Can't verify user permissions without authentication.",
      );
    }

    const userPermissions = user.permissions || [];

    const missingPermissions: { resource: string; action: string }[] = [];

    for (const [resource, actions] of Object.entries(requiredPermissions)) {
      for (const action of actions) {
        if (
          !userPermissions.some(
            (userPermission) =>
              (userPermission.action === "EVERYTHING" ||
                userPermission.action === action) &&
              (userPermission.resource === "EVERYTHING" ||
                userPermission.resource === resource),
          )
        ) {
          missingPermissions.push({ resource, action });
        }
      }
    }

    if (missingPermissions.length > 0) {
      throw new ForbiddenError(
        `Insufficient permissions to perform this action. Missing required permission(s): [${missingPermissions
          .map((permission) => `${permission.resource}:${permission.action}`)
          .join(", ")}]. User permissions: [${userPermissions
          .map((perm) => `${perm.resource}:${perm.action}`)
          .join(", ")}].`,
      );
    }

    return next();
  };
};
