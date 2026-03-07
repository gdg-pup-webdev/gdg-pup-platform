import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { RequestHandler } from "express";

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

  private getAuthenticatedUserId = (req: Express.Request): string => {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError(
        "Authentication required. No authenticated user found in request context.",
      );
    }

    return userId;
  };

  private loadUserAccessProfile = async (
    userId: string,
  ): Promise<UserAccessProfile> => {
    const { data, error } = await supabase
      .from("user_role_junction")
      .select(
        `
          user_role!inner(
            name,
            user_role_permission(
              resource,
              action
            )
          )
        `,
      )
      .eq("user_id", userId);

    if (error) {
      throw new InternalServerError(
        `Unable to load roles and permissions for user '${userId}'.`,
        error,
      );
    }

    const roleNames = Array.from(
      new Set(
        (data || [])
          .map((row: any) => row.user_role?.name)
          .filter((name: unknown): name is string => typeof name === "string"),
      ),
    );

    const permissions = (data || []).flatMap((row: any) => {
      const rows = row.user_role?.user_role_permission || [];

      return rows
        .filter(
          (p: any) =>
            typeof p?.resource === "string" && typeof p?.action === "string",
        )
        .map((p: any) => ({
          resource: p.resource,
          action: p.action,
        }));
    });

    return {
      roleNames,
      permissions,
    };
  };

  private hasPermission = (
    permissions: UserPermission[],
    resourceName: string,
    actionName: string,
  ): boolean => {
    return permissions.some(
      (permission) =>
        (permission.resource === resourceName || permission.resource === "*") &&
        (permission.action === actionName || permission.action === "*"),
    );
  };

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
        const userId = this.getAuthenticatedUserId(req);
        const { roleNames } = await this.loadUserAccessProfile(userId);

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

  requirePermissions =
    (
      resourceName: string,
      requiredActions: string | string[],
    ): RequestHandler =>
    async (req, res, next) => {
      try {
        const userId = this.getAuthenticatedUserId(req);
        const { roleNames, permissions } =
          await this.loadUserAccessProfile(userId);
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

        const missingActions = actions.filter(
          (actionName) =>
            !this.hasPermission(permissions, resourceName, actionName),
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
}

export const authMiddlewareInstance = new AuthMiddleware();
