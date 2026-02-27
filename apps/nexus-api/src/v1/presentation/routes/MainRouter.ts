import { Router, Express } from "express";
import { FilesRouter } from "./files/files.router";
import { AuthRouter } from "./auth-system/auth.route";
import { HealthRouter } from "./health/healthCheck.route";

export class MainRouter {
  router: Router;

  constructor(
    private filesRouter: FilesRouter,
    private authRouter: AuthRouter,
    private healthRouter: HealthRouter,
  ) {
    this.router = Router();

    this.router.use("/files", this.filesRouter.router);
    this.router.use("/auth-system", this.authRouter.router);
    this.router.use("/health", this.healthRouter.router);

    this.router.get("/", (req, res) => {
      res.status(200).json({ message: "Nexus API v1" });
    });
  }
}
