import { ServerError } from "@/classes/ServerError.js";
import { RequestHandler } from "express";

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
      throw new ServerError(
        401,
        "Unauthenticated",
        "You must be logged in to access this resource."
      );
    }

    next();
  };

  requireAdminRole = (): RequestHandler => (req, res, next) => {
    const role = req.role;

    if (!role || role !== "admin") {
      throw new ServerError(
        403,
        "Forbidden",
        "You must be an admin to perform this action."
      );
    }

    next();
  };

  requireAnyOfTheseRoles =
    (allowedRoles: string[]): RequestHandler =>
    (req, res, next) => {
      const userRole = req.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new ServerError(
          403,
          "Forbidden",
          "You do not have permission to perform this action."
        );
      }

      next();
    };
}

export const authMiddlewareInstance = new AuthMiddleware();
