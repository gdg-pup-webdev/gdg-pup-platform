import { Express, Router } from "express";
import { HealthRouter } from "../routes/health/healthCheck.route";
import { HealthHttpController } from "../routes/health/healthCheck.controller";
import { filesModuleController } from "@/v1/modules/filesModule";
import { FilesHttpController } from "../routes/files/files.controller";
import { FilesRouter } from "../routes/files/files.router";
import { FoldersHttpController } from "../routes/folders/folders.controller";
import { FoldersRouter } from "../routes/folders/folders.router";
import { GdgScrapedEventsHttpController } from "../routes/gdg-scraped-events/gdgScrapedEvents.controller";
import { bevyEventController } from "../modules/bevyEvents";
import { GdgScrapedEventsRouter } from "../routes/gdg-scraped-events/gdgScrapedEvents.router";
import { taskModuleController } from "../modules/memberTasks";
import { TasksHttpController } from "../routes/tasks/tasks.controller";
import { TasksRouter } from "../routes/tasks/tasks.router";
import { RolesRouter } from "../routes/roles/roles.router";
import { RolesHttpController } from "../routes/roles/roles.controller";
import { rbacController } from "../modules/rbacSystem";
import { GdgTeamsHttpController } from "../routes/gdg-teams/gdgTeams.controller";
import { GdgTeamsRouter } from "../routes/gdg-teams/gdgTeams.router";
import { gdgMerchController } from "@/v1/modules/gdgMerch";
import { GdgMerchHttpController } from "../routes/gdg-merch/gdgMerch.controller";
import { GdgMerchRouter } from "../routes/gdg-merch/gdgMerch.router";
import { pointSystemController } from "@/v1/modules/pointsSystem";
import { PointsHttpController } from "../routes/points/points.controller";
import { PointsRouter } from "../routes/points/points.router";
import { learningResourceController } from "@/v1/modules/learningResources";
import { LearningResourcesHttpController } from "../routes/learning-resources/learning-resources.controller";
import { LearningResourcesRouter } from "../routes/learning-resources/learning-resources.router";
import { StudyJamsHttpController } from "../routes/study-jams/studyJams.controller";
import { StudyJamsRouter } from "../routes/study-jams/studyJams.router";
import { eventSystemController } from "@/v1/modules/eventSystem";
import { EventsHttpController } from "../routes/events/events.controller";
import { EventsRouter } from "../routes/events/events.router";
import { ArticlesHttpController } from "../routes/articles/articles.controller";
import { ArticlesRouter } from "../routes/articles/articles.router";
import { AuthenticationHttpController } from "../routes/authentication/authentication.controller";
import { authenticationController } from "../modules/authentication";
import { gdgMembersController } from "../modules/members";
import { AuthenticationRouter } from "../routes/authentication/authentication.router";
import { GdgMembersHttpController } from "../routes/gdgmembers/gdgmembers.controller";
import { GdgMembersRouter } from "../routes/gdgmembers/gdgmembers.router";
import { NfcCardsRouter } from "../routes/nfc-cards/nfcCards.router";
import { NfcCardsHttpController } from "../routes/nfc-cards/nfcCards.controller";
import { nfcCardsModuleController } from "../modules/nfcCards";
import { memberShowcaseController } from "../modules/MemberShowcase"; 
import {
  MemberShowcaseHttpController, 
} from "../routes/member-showcase/MemberShowcase";
import { memberProjectsController } from "../modules/memberProjects";
import {
  MemberProjectsHttpController,
  MemberProjectsRouter,
} from "../routes/member-projects/MemberProjects";
import { articlesController } from "../modules/articles";
import { productController } from "../modules/products";
import { ProductHttpController } from "../routes/products/products.controller";
import { ProductRouter } from "../routes/products/products.router";
import { AnalyticsHttpController } from "../routes/analytics/analytics.controller";
import { AnalyticsRouter } from "../routes/analytics/analytics.router";
import { analyticsController } from "../modules/analytics";
import { MemberShowcaseRouter } from "../routes/member-showcase/MemberShowcaseRouter";

export const loadRoutes = (app: Express) => {
  const analyticsHttpController = new AnalyticsHttpController(
    analyticsController,
  );
  const analyticsRouter = new AnalyticsRouter(analyticsHttpController);

  const gdgMembersHttpController = new GdgMembersHttpController(
    gdgMembersController, rbacController, nfcCardsModuleController
  );
  const gdgMembersRouter = new GdgMembersRouter(gdgMembersHttpController);

  const articlesHttpController = new ArticlesHttpController(articlesController);
  const articlesRouter = new ArticlesRouter(articlesHttpController);

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

  const gdgTeamsHttpController = new GdgTeamsHttpController();
  const gdgTeamsRouter = new GdgTeamsRouter(gdgTeamsHttpController);

  const gdgMerchHttpController = new GdgMerchHttpController(gdgMerchController);
  const gdgMerchRouter = new GdgMerchRouter(gdgMerchHttpController);

  const learningResourcesHttpController = new LearningResourcesHttpController(
    learningResourceController,
  );
  const learningResourcesRouter = new LearningResourcesRouter(
    learningResourcesHttpController,
  );

  const authenticationHttpController = new AuthenticationHttpController(
    authenticationController,
  );
  const authenticationRouter = new AuthenticationRouter(
    authenticationHttpController,
  );

  const nfcCardsHttpController = new NfcCardsHttpController(
    nfcCardsModuleController,
  );
  const nfcCardsRouter = new NfcCardsRouter(nfcCardsHttpController);

  const memberShowcaseHttpController = new MemberShowcaseHttpController(
    memberShowcaseController,
  );
  const memberShowcaseRouter = new MemberShowcaseRouter(
    memberShowcaseHttpController,
  );

  const memberProjectsHttpController = new MemberProjectsHttpController(
    memberProjectsController,
  );
  const memberProjectsRouter = new MemberProjectsRouter(
    memberProjectsHttpController,
  );
  const studyJamsHttpController = new StudyJamsHttpController();
  const studyJamsRouter = new StudyJamsRouter(studyJamsHttpController);

  const productHttpController = new ProductHttpController(productController);
  const productRouter = new ProductRouter(productHttpController);

  app.use("/files", filesRouter.router);
  app.use("/folders", foldersRouter.router);
  // app.use("/auth-system", authRouter.router);
  app.use("/health", healthRouter.router);
  app.use("/gdg-scraped-events", gdgScrapedEventsRouter.router);
  app.use("/tasks", tasksRouter.router);
  app.use("/roles", rolesRouter.router);
  // app.use("/users", usersRouter.router);
  app.use("/gdg-teams", gdgTeamsRouter.router);
  // app.use("/sparkmates", sparkmatesRouter.router);
  // app.use("/nfc-system", nfcSystemRouter.router);
  app.use("/gdg-merch", gdgMerchRouter.router);
  app.use("/points", pointsRouter.router);
  app.use("/learning-resources", learningResourcesRouter.router);
  app.use("/study-jams", studyJamsRouter.router);
  app.use("/events", eventsRouter.router);
  app.use("/event-system", eventsRouter.router);
  app.use("/articles", articlesRouter.router);
  app.use("/authentication", authenticationRouter.router);
  app.use("/gdgmembers", gdgMembersRouter.router);
  app.use("/nfc-cards", nfcCardsRouter.router);
  app.use("/member-showcase", memberShowcaseRouter.router);
  app.use("/member-projects", memberProjectsRouter.router);
  app.use("/products", productRouter.router);
  app.use("/analytics", analyticsRouter.router);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Nexus API v1" });
  });
};
