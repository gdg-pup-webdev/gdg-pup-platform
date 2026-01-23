import { Router } from "express";
import {
  CertificateController,
  certificateControllerInstance,
} from "./certificate.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class CertificateRouter {
  constructor(
    private certificateController: CertificateController = certificateControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.certificateController.listUserCertificates);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.certificateController.createCertificate,
    );

    router.get("/:certificateId", this.certificateController.getOneCertificate);

    router.delete(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.deleteCertificate,
    );

    router.patch(
      "/:certificateId",
      this.authMiddleware.requireAuth(),
      this.certificateController.updateCertificate,
    );

    return router;
  }
}

export const certificateRouterInstance = new CertificateRouter();
