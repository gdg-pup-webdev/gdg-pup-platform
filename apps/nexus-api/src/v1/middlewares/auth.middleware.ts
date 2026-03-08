import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { RequestHandler } from "express";
import { rbacController } from "../modules/rbacSystem";

type UserPermission = {
  resource: string;
  action: string;
};

type UserAccessProfile = {
  roleNames: string[];
  permissions: UserPermission[];
};

/**
 * USAGE:
 * - insert into dependencies of the router
 * constructor(private authMiddleware: AuthMiddleware) {}
 *
 * - use in router
 * router.use(this.authMiddleware.requireAuth());
 *
 * - use in specific route
 * router.get('/admin', this.authMiddleware.requireAdminRole(), this.adminController.getAdminData);
 */
export class AuthMiddleware {
  constructor() {}

  requireAuth = (): RequestHandler => (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError(
        "Authentication required. Please provide a valid Bearer token.",
      );
    }

    next();
  };

  requireAdminRole = (): RequestHandler =>
    this.requireAnyOfTheseRoles(["admin"]);

  requireAnyOfTheseRoles =
    (allowedRoles: string[]): RequestHandler =>
    async (req, res, next) => {
      try {
        const userId = req.user?.id;

        if (!userId) {
          throw new UnauthorizedError(
            "Authentication required. No authenticated user found in request context.",
          );
        }

        const roleNames = (
          await rbacController.getRolesAndPermissionsOfUser(userId)
        ).map((role) => role.name);

        // const { roleNames } = await this.loadUserAccessProfile(userId);

        const allowedSet = new Set(allowedRoles);
        const hasAllowedRole = roleNames.some((roleName) =>
          allowedSet.has(roleName),
        );

        if (!hasAllowedRole) {
          throw new ForbiddenError(
            `Access denied. User '${userId}' has roles [${
              roleNames.join(", ") || "none"
            }], but one of [${allowedRoles.join(", ")}] is required.`,
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };

  /**
   * @deprecated
   */
  requirePermissions_deprecated =
    (
      resourceName: string,
      requiredActions: string | string[],
    ): RequestHandler =>
    async (req, res, next) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new UnauthorizedError(
            "Authentication required. No authenticated user found in request context.",
          );
        }

        const rolesAndPermissions =
          await rbacController.getRolesAndPermissionsOfUser(userId);
        const roleNames = rolesAndPermissions.map((role) => role.name);
        const permissions = rolesAndPermissions.flatMap(
          (role) => role.permissions,
        );

        // const { roleNames, permissions } =
        //   await this.loadUserAccessProfile(userId);
        const actions = Array.from(
          new Set(
            (Array.isArray(requiredActions)
              ? requiredActions
              : [requiredActions]
            ).filter((action) => Boolean(action && action.trim())),
          ),
        );

        if (actions.length === 0) {
          throw new ForbiddenError(
            "RBAC middleware misconfiguration: at least one required action must be provided.",
          );
        }

        const hasPermission = (
          permissions: UserPermission[],
          resourceName: string,
          actionName: string,
        ): boolean => {
          return permissions.some(
            (permission) =>
              (permission.resource === resourceName ||
                permission.resource === "*") &&
              (permission.action === actionName || permission.action === "*"),
          );
        };
        const missingActions = actions.filter(
          (actionName) => !hasPermission(permissions, resourceName, actionName),
        );

        if (missingActions.length > 0) {
          throw new ForbiddenError(
            `Access denied for resource '${resourceName}'. Missing required action(s): [${missingActions.join(
              ", ",
            )}]. User roles: [${roleNames.join(", ") || "none"}].`,
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };

  requirePermissions =
    (
      requiredPermissions: Record<string, string[]>,
    ): RequestHandler =>
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError(
          "Authentication required. No authenticated user found in request context.",
        );
      }

      const rolesAndPermissions =
        await rbacController.getRolesAndPermissionsOfUser(userId);

      const userPermissions = rolesAndPermissions.flatMap(
        (role) => role.permissions,
      );

      const missingPermissions = Object.entries(requiredPermissions).flatMap(
        ([resource, actions]) =>
          actions.filter((action) => {
            return !userPermissions.some(
              (userPermission) =>
                userPermission.action === action &&
                userPermission.resource === resource,
            );
          }).map((action) => ({
            resource: resource,
            action,
          })),
      );

      if (missingPermissions.length > 0) {
        throw new ForbiddenError(
          `Access denied. Missing required permission(s): [${missingPermissions
            .map((permission) => `${permission.resource}:${permission.action}`)
            .join(", ")}]. User roles: [${rolesAndPermissions
            .map((role) => role.name)
            .join(", ")}].`,
        );
      }

      next();
    };
}

export const authMiddlewareInstance = new AuthMiddleware();
