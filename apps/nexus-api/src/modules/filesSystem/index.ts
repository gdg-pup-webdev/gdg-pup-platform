import { Router } from "express";
import { FileRouter, fileRouterInstance } from "./files/file.route.js";

export class FileSystemRouter {
  constructor(private readonly fileRouter: FileRouter = fileRouterInstance) {}

  getRouter(): Router {
    const router = Router();

    router.use("/files", this.fileRouter.getRouter());

    return router;
  }
}

export const fileSystemRouterInstance = new FileSystemRouter();
