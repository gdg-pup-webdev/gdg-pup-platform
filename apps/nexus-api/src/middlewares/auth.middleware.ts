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
      throw ServerError.unauthorized();
    }

    next();
  };

  requireAdminRole = (): RequestHandler => (req, res, next) => {
    const role = req.role;

    if (!role || role !== "admin") {
      throw ServerError.forbidden("You must be an admin to perform this action.");
    }

    next();
  };

  requireAnyOfTheseRoles =
    (allowedRoles: string[]): RequestHandler =>
    (req, res, next) => {
      const userRole = req.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw ServerError.forbidden(
          "You do not have permission to perform this action."
        );
      }

      next();
    };
}

export const authMiddlewareInstance = new AuthMiddleware();
