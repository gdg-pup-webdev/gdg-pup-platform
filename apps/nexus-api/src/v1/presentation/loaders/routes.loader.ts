import { Express } from "express";
import { AuthRouter } from "../routes/auth-system/auth.route";
import { AuthHttpController } from "../routes/auth-system/auth.controller";
import { authMiddlewareInstance } from "../middlewares/auth.middleware";
import { HealthRouter } from "../routes/health/healthCheck.route";
import { HealthHttpController } from "../routes/health/healthCheck.controller";
import { supabase } from "@/v1/lib/supabase";
import { AuthService } from "@/v1/modules/authSystem";
import { filesModuleController } from "@/v1/modules/filesModule";
import { MainRouter } from "../routes/MainRouter";
import { FilesHttpController } from "../routes/files/files.controller";
import { FilesRouter } from "../routes/files/files.router";

export const routesLoader = (app: Express) => {
  ///////////////////////////////////////////////
  //
  // VERSION 1 ROUTES
  //
  ///////////////////////////////////////////////

  const supabaseClient = supabase;
  const authMiddleware = authMiddlewareInstance;

  const filesHttpController = new FilesHttpController(filesModuleController);
  const filesRouter = new FilesRouter(filesHttpController);

  const authService = new AuthService(supabaseClient);
  const authHttpController = new AuthHttpController(authService);
  const authRouter = new AuthRouter(authHttpController);

  const healthHttpController = new HealthHttpController();
  const healthRouter = new HealthRouter(healthHttpController);

  const apiV1Router = new MainRouter(filesRouter, authRouter, healthRouter);

  app.use("/api/v1", apiV1Router.router);
};
