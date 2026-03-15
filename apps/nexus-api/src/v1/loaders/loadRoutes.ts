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
import { GdgScrapedEventsHttpController } from "../routes/gdg-scraped-events/gdgScrapedEvents.controller";
import { bevyEventController } from "../modules/bevyEvents";
import { GdgScrapedEventsRouter } from "../routes/gdg-scraped-events/gdgScrapedEvents.router";
import { taskModuleController } from "../modules/tasksModule";
import { TasksHttpController } from "../routes/tasks/tasks.controller";
import { TasksRouter } from "../routes/tasks/tasks.router";
import { RolesRouter } from "../routes/roles/roles.router";
import { RolesHttpController } from "../routes/roles/roles.controller";
import { rbacController } from "../modules/rbacSystem";
import { UsersRouter } from "../routes/users/users.router";
import { UsersHttpController } from "../routes/users/users.controller";
import { portfolioModuleController } from "../modules/portfolioModule";
import { PortfoliosHttpController } from "../routes/portfolios/portfolios.controller";
import { PortfoliosRouter } from "../routes/portfolios/portfolios.router";

export const loadRoutes = (app: Express) => {
  const supabaseClient = supabase;

  const filesHttpController = new FilesHttpController(filesModuleController);
  const filesRouter = new FilesRouter(filesHttpController);

  const authService = new AuthService(supabaseClient);
  const authHttpController = new AuthHttpController(authService);
  const authRouter = new AuthRouter(authHttpController);

  const healthHttpController = new HealthHttpController();
  const healthRouter = new HealthRouter(healthHttpController);

  const gdgScrapedEventsHttpController = new GdgScrapedEventsHttpController(
    bevyEventController,
  );
  const gdgScrapedEventsRouter = new GdgScrapedEventsRouter(
    gdgScrapedEventsHttpController,
  );

  const rolesHttpController = new RolesHttpController(rbacController);
  const rolesRouter = new RolesRouter(rolesHttpController);
  const tasksHttpController = new TasksHttpController(taskModuleController);
  const tasksRouter = new TasksRouter(tasksHttpController);
 


  const usersHttpController = new UsersHttpController(rbacController);
  const usersRouter = new UsersRouter(usersHttpController);

  const portfoliosHttpController = new PortfoliosHttpController(
    portfolioModuleController,
  );
  const portfoliosRouter = new PortfoliosRouter(portfoliosHttpController);

  app.use("/files", filesRouter.router);
  app.use("/auth-system", authRouter.router);
  app.use("/health", healthRouter.router);
  app.use("/gdg-scraped-events", gdgScrapedEventsRouter.router);
  app.use("/tasks", tasksRouter.router);
  app.use("/roles", rolesRouter.router);
  app.use("/users", usersRouter.router);
  app.use("/portfolios", portfoliosRouter.router);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Nexus API v1" });
  });
};
