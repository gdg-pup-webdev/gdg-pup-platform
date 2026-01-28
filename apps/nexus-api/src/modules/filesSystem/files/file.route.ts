import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";
import { FileController, fileControllerInstance } from "./file.controller.js";

export class FileRouter {
  constructor(
    private controller: FileController = fileControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter(): Router {
    const router = Router();

    router.get("/", this.controller.listFiles);
    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.controller.createFile,
    );
    router.get("/:fileId", this.controller.getFile);
    router.patch(
      "/:fileId",
      this.authMiddleware.requireAuth(),
      this.controller.updateFile,
    );
    router.delete(
      "/:fileId",
      this.authMiddleware.requireAuth(),
      this.controller.deleteFile,
    );

    return router;
  }
}

export const fileRouterInstance = new FileRouter();
