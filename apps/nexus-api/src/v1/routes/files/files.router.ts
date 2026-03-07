import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { FilesHttpController } from "./files.controller";

export class FilesRouter {
  router: Router;

  constructor(
    private filesHttpController: FilesHttpController,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get(
      "/",
      this.authMiddleware.requirePermissions("file-system", ["read"]),
      this.filesHttpController.listFiles,
    );
    this.router.post(
      "/",
      this.authMiddleware.requirePermissions("file-system", ["create"]),
      this.filesHttpController.uploadFile,
    );
    this.router.delete(
      "/:fileId",
      this.authMiddleware.requirePermissions("file-system", ["delete"]),
      this.filesHttpController.deleteFileById,
    );
    this.router.patch(
      "/:fileId",
      this.authMiddleware.requirePermissions("file-system", ["update"]),
      this.filesHttpController.updateFileById,
    );
    this.router.get(
      "/:fileId",
      this.authMiddleware.requirePermissions("file-system", ["read"]),
      this.filesHttpController.getOneFileById,
    );
  }
}
