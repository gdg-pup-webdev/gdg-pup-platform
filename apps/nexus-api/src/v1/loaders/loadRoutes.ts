import { Express, Router } from "express";
import { AuthRouter } from "../routes/auth-system/auth.route";
import { AuthHttpController } from "../routes/auth-system/auth.controller";
import { HealthRouter } from "../routes/health/healthCheck.route";
import { HealthHttpController } from "../routes/health/healthCheck.controller";
import { supabase } from "@/v1/lib/supabase";
import { AuthService } from "@/v1/modules/authSystem";
import { filesModuleController } from "@/v1/modules/filesModule";
import { FilesHttpController } from "../routes/files/files.controller";
import { FilesRouter } from "../routes/files/files.router";
export const loadRoutes = (app: Express) => {
  const supabaseClient = supabase;

  const filesHttpController = new FilesHttpController(filesModuleController);
  const filesRouter = new FilesRouter(filesHttpController);

  const authService = new AuthService(supabaseClient);
  const authHttpController = new AuthHttpController(authService);
  const authRouter = new AuthRouter(authHttpController);

  const healthHttpController = new HealthHttpController();
  const healthRouter = new HealthRouter(healthHttpController);

  app.use("/files", filesRouter.router);
  app.use("/auth-system", authRouter.router);
  app.use("/health", healthRouter.router);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Nexus API v1" });
  });
};
