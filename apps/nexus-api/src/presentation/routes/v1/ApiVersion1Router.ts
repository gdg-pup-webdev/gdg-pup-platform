import { Router, Express } from "express";
import { FilesRouter } from "./files/files.router";

export class ApiVersion1Router {
  router: Router;

  constructor(private filesRouter: FilesRouter) {
    this.router = Router();

    this.router.use("/files", this.filesRouter.router);

    this.router.get("/", (req, res) => {
      res.status(200).json({ message: "this is root of nexus api, version 1" });
    });
  }
}
