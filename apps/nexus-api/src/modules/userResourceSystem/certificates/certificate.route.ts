/**
 * @file certificate.route.ts
 * @description HTTP Routing configuration for User Certificates.
 * This file defines the API endpoints for creating, retrieving, updating, and deleting
 * certificates owned by users, integrating authentication where necessary.
 */

import { Router } from "express";
import {
  CertificateController,
  certificateControllerInstance,
} from "./certificate.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";

/**
 * CertificateRouter
 * Responsible for mapping HTTP verbs and paths to the appropriate controller actions.
 */
export class CertificateRouter {
  /**
   * @param certificateController - Controller handling certificate operations.
   * @param authMiddleware - Middleware for protecting sensitive routes.
   */
  constructor(
    private readonly certificateController: CertificateController = certificateControllerInstance,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  /**
   * getRouter
   * Configures and returns the Express router for certificate management.
   * @returns {Router} The configured router instance.
   */
  getRouter() {
    const router: Router = Router();

    /** 
     * GET /api/user-resource-system/certificates
     * Publicly list all certificates or filter by user via query params.
     */
    router.get("/", this.certificateController.listUserCertificates);

    /** 
     * POST /api/user-resource-system/certificates
     * Create a new certificate record. (Requires Authentication)
     */
    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.certificateController.createCertificate,
    );

    /** 
     * GET /api/user-resource-system/certificates/:certificateId
     * Fetch details of a single certificate.
     */
    router.get("/:certificateId", this.certificateController.getOneCertificate);

    /** 
     * DELETE /api/user-resource-system/certificates/:certificateId
     * Remove a certificate record. (Requires Authentication)
     */
    router.delete(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.deleteCertificate,
    );

    /** 
     * PATCH /api/user-resource-system/certificates/:certificateId
     * Update metadata for an existing certificate. (Requires Authentication)
     */
    router.patch(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.updateCertificate,
    );

    return router;
  }
}

/**
 * Exported singleton instance of the CertificateRouter.
 */
export const certificateRouterInstance = new CertificateRouter();
