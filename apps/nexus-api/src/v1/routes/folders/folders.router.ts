import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { FoldersHttpController } from "./folders.controller";

export class FoldersRouter {
  router: Router;

  constructor(
    private foldersHttpController: FoldersHttpController,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get(
      "/",
      // this.authMiddleware.requirePermissions({ "folders": ["read"] }),
      this.foldersHttpController.listFolders,
    );
    this.router.post(
      "/",
      // this.authMiddleware.requirePermissions({ "folders": ["create"] }),
      this.foldersHttpController.createFolder,
    );
  }
}
