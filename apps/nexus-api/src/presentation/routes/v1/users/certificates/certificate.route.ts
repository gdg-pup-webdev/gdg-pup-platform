/**
 * @file certificate.route.ts
 * @description HTTP Routing configuration for User Certificates.
 * This file defines the API endpoints for creating, retrieving, updating, and deleting
 * certificates owned by users, integrating authentication where necessary.
 */

import { Router } from "express";
import { CertificatesHttpController } from "./certificate.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class CertificatesRouter {
  router: Router;

  constructor(
    private readonly certificateController: CertificatesHttpController,
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.certificateController.listUserCertificates);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.certificateController.createCertificate,
    );

    this.router.get(
      "/:certificateId",
      this.certificateController.getOneCertificate,
    );

    this.router.delete(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.deleteCertificate,
    );

    this.router.patch(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.updateCertificate,
    );
  }
}
