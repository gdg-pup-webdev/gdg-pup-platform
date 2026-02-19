import { Router } from "express";
import { FilesHttpController } from "./files.controller";

export class FilesRouter {
  router: Router;

  constructor(private filesHttpController: FilesHttpController) {
    this.router = Router();

    this.router.get("/", this.filesHttpController.listFiles);
    this.router.post("/", this.filesHttpController.uploadFile);
    this.router.delete("/:fileId", this.filesHttpController.deleteFileById);
    this.router.patch("/:fileId", this.filesHttpController.updateFileById);
    this.router.get("/:fileId", this.filesHttpController.getOneFileById);
  }
}
