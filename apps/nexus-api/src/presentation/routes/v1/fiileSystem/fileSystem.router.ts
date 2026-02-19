import { Router } from "express";
import { FileSystemController } from "./fileSystem.controller";

export class FileSystemRoter {
  router: Router;

  constructor(
    private fileSystemController: FileSystemController = new FileSystemController(),
  ) {
    this.router = Router();

    this.router.get("/", this.fileSystemController.listFiles);
    this.router.post("/", this.fileSystemController.uploadFile);
    this.router.delete("/:fileId", this.fileSystemController.deleteFileById);
    this.router.patch("/:fileId", this.fileSystemController.updateFileById);
    this.router.get("/:fileId", this.fileSystemController.getOneFileById);
  }
}
