import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { FilesHttpController } from "./files.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class FilesRouter {
  router: Router;

  constructor(
    private filesHttpController: FilesHttpController,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.use(
      requirePermissions({
        files: ["mutations", "queries"],
      }),
    );

    // Files routes
    this.router.get("/", this.filesHttpController.listFiles);
    this.router.post("/", this.filesHttpController.uploadFile);
    this.router.delete("/:fileId", this.filesHttpController.deleteFileById);
    this.router.patch("/:fileId", this.filesHttpController.updateFileById);
    this.router.get("/:fileId", this.filesHttpController.getOneFileById);
  }
}
