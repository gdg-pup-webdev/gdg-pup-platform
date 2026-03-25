import { Express, Router } from "express";
import { AuthRouter } from "../routes/auth-system/auth.route";
import { AuthHttpController } from "../routes/auth-system/auth.controller";
import { HealthRouter } from "../routes/health/healthCheck.route";
import { HealthHttpController } from "../routes/health/healthCheck.controller";
import { supabase } from "@/v1/lib/supabase";
import { AuthService } from "@/v1/modules/authSystem_DEPRECATED";
import { filesModuleController } from "@/v1/modules/filesModule";
import { FilesHttpController } from "../routes/files/files.controller";
import { FilesRouter } from "../routes/files/files.router";
import { FoldersHttpController } from "../routes/folders/folders.controller";
import { FoldersRouter } from "../routes/folders/folders.router";
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
import { GdgTeamsHttpController } from "../routes/gdg-teams/gdgTeams.controller";
import { GdgTeamsRouter } from "../routes/gdg-teams/gdgTeams.router";
import { sparkmatesModuleController } from "../modules/sparkmatesModule";
import { SparkmatesHttpController } from "../routes/sparkmates/sparkmates.controller";
import { SparkmatesRouter } from "../routes/sparkmates/sparkmates.router";
import { NfcSystemHttpController } from "@/v1/routes/nfc-system/nfcSystem.controller";
import { NfcSystemRouter } from "@/v1/routes/nfc-system/nfcSystem.router";
import { gdgMerchController } from "@/v1/modules/gdgMerch";
import { GdgMerchHttpController } from "../routes/gdg-merch/gdgMerch.controller";
import { GdgMerchRouter } from "../routes/gdg-merch/gdgMerch.router";
import { pointSystemController } from "@/v1/modules/pointsSystem";
import { PointsHttpController } from "../routes/points/points.controller";
import { PointsRouter } from "../routes/points/points.router";
import { teamResourceController } from "@/v1/modules/teamResources";
import { TeamResourcesHttpController } from "../routes/teamResources/team-resources.controller";
import { TeamResourcesRouter } from "../routes/teamResources/team-resources.router";
import { eventSystemController } from "@/v1/modules/eventSystem";
import { EventsHttpController } from "../routes/events/events.controller";
import { EventsRouter } from "../routes/events/events.router";
import { eventHighlightsController } from "../modules/eventHighlights";
import { EventHighlightsHttpController } from "../routes/event-highlights/eventHighlights.controller";
import { EventHighlightsRouter } from "../routes/event-highlights/eventHighlights.router";
import { AuthenticationHttpController } from "../routes/authentication/authentication.controller";
import { authenticationController } from "../modules/authentication";
import { oneTimePinController } from "../modules/oneTimePin";
import { gdgMembersController } from "../modules/gdgMembers";
import { configs } from "@/configs/configs";
import { AuthenticationRouter } from "../routes/authentication/authentication.router";
import { GdgMembersHttpController } from "../routes/gdgmembers/gdgmembers.controller";
import { GdgMembersRouter } from "../routes/gdgmembers/gdgmembers.router";

export const loadRoutes = (app: Express) => {
  const supabaseClient = supabase;

  const gdgMembersHttpController = new GdgMembersHttpController(
    gdgMembersController,
  );
  const gdgMembersRouter = new GdgMembersRouter(gdgMembersHttpController);

  const eventHighlightsHttpController = new EventHighlightsHttpController(
    eventHighlightsController,
  );
  const eventHighlightsRouter = new EventHighlightsRouter(
    eventHighlightsHttpController,
  );

  const pointsHttpController = new PointsHttpController(pointSystemController);
  const pointsRouter = new PointsRouter(pointsHttpController);

  const eventsHttpController = new EventsHttpController(eventSystemController);
  const eventsRouter = new EventsRouter(eventsHttpController);

  const filesHttpController = new FilesHttpController(filesModuleController);
  const filesRouter = new FilesRouter(filesHttpController);

  const foldersHttpController = new FoldersHttpController(
    filesModuleController,
  );
  const foldersRouter = new FoldersRouter(foldersHttpController);

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

  const gdgTeamsHttpController = new GdgTeamsHttpController();
  const gdgTeamsRouter = new GdgTeamsRouter(gdgTeamsHttpController);
  const sparkmatesHttpController = new SparkmatesHttpController(
    sparkmatesModuleController,
  );
  const sparkmatesRouter = new SparkmatesRouter(sparkmatesHttpController);

  const nfcSystemHttpController = new NfcSystemHttpController(
    sparkmatesModuleController,
  );
  const nfcSystemRouter = new NfcSystemRouter(nfcSystemHttpController);

  const gdgMerchHttpController = new GdgMerchHttpController(gdgMerchController);
  const gdgMerchRouter = new GdgMerchRouter(gdgMerchHttpController);

  const teamResourcesHttpController = new TeamResourcesHttpController(
    teamResourceController,
  );
  const teamResourcesRouter = new TeamResourcesRouter(
    teamResourcesHttpController,
  );

  const authenticationHttpController = new AuthenticationHttpController(
    authenticationController,
  );
  const authenticationRouter = new AuthenticationRouter(
    authenticationHttpController,
  );

  app.use("/files", filesRouter.router);
  app.use("/folders", foldersRouter.router);
  app.use("/auth-system", authRouter.router);
  app.use("/health", healthRouter.router);
  app.use("/gdg-scraped-events", gdgScrapedEventsRouter.router);
  app.use("/tasks", tasksRouter.router);
  app.use("/roles", rolesRouter.router);
  app.use("/users", usersRouter.router);
  app.use("/gdg-teams", gdgTeamsRouter.router);
  app.use("/sparkmates", sparkmatesRouter.router);
  app.use("/nfc-system", nfcSystemRouter.router);
  app.use("/gdg-merch", gdgMerchRouter.router);
  app.use("/points", pointsRouter.router);
  app.use("/team-resources", teamResourcesRouter.router);
  app.use("/events", eventsRouter.router);
  app.use("/event-system", eventsRouter.router);
  app.use("/event-highlights", eventHighlightsRouter.router);
  app.use("/authentication", authenticationRouter.router);
  app.use("/gdgmembers", gdgMembersRouter.router);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Nexus API v1" });
  });
};
