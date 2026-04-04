import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { FoldersHttpController } from "./folders.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class FoldersRouter {
  router: Router;

  constructor(
    private foldersHttpController: FoldersHttpController,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.use(
      requirePermissions({
        folders: ["queries", "mutations"],
      }),
    );

    this.router.get("/", this.foldersHttpController.listFolders);
    this.router.post("/", this.foldersHttpController.createFolder);

    this.router.get("/:folderId", this.foldersHttpController.getOneFolderById);
    this.router.delete(
      "/:folderId",
      this.foldersHttpController.deleteFolderById,
    );
  }
}
