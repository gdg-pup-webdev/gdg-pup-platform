import { Express } from "express";
import { healthCheckModuleRouterInstance } from "@/modules/healthCheck/index.js";
import { learningResourceSystemRouterInstance } from "@/modules/learningResourceSystem/index.js";
import { userResourceSystemRouter } from "@/modules/userResourceSystem/index.js"; 
import { eventSystemRouterInstance } from "@/modules/eventSystem/index.js";
import { publicationSystemRouterInstance } from "@/modules/publicationSystem/index.js";
import { userSystemRouterInstance } from "@/modules/userSystem/index.js";
import { teamSystemRouterInstance } from "@/modules/teamsSystem/index.js";
import { rewardSystemRouterInstance } from "@/modules/rewardsSystem/index.js";
import { rbacSystemRouterInstance } from "@/modules/rbacSystem/index.js";
import { ApiVersion1Router } from "@/presentation/routes/v1/ApiVersion1Router";
import {
  AuthService,
  authSystemRouterInstance,
} from "@/modules/authSystem/index.js";
import { memberSystemRouterInstance } from "@/modules/memberSystem/index.js";
import { FilesRouter } from "@/presentation/routes/v1/files/files.router";
import { filesModuleController } from "@/modules/filesModule";
import { FilesHttpController } from "@/presentation/routes/v1/files/files.controller";
import { getDeprecationWarningInterceptor } from "@/presentation/middlewares/deprecatedWarningInterceptor.middleware";
import { DocsRouter } from "@/presentation/routes/docs/docs.loader";
import { AuthRouter } from "../routes/v1/auth/auth.route";
import { AuthHttpController } from "../routes/v1/auth/auth.controller";
import { supabase } from "@/lib/supabase";
import { EventsRouter } from "../routes/v1/events/event.route";
import { EventsHttpController } from "../routes/v1/events/event.controller";
import { EventService } from "@/modules/eventSystem/events/event.service";
import { authMiddlewareInstance } from "../middlewares/auth.middleware";
import { AttendanceService } from "@/modules/eventSystem/attendance/attendance.service";
import { HealthRouter } from "../routes/v1/health/healthCheck.route";
import { HealthHttpController } from "../routes/v1/health/healthCheck.controller";
import { LearningResourcesRouter } from "../routes/v1/learning-resources/learningResources.route";
import { LearningResourcesHttpController } from "../routes/v1/learning-resources/learningResources.controller";
import { resourceServiceInstance } from "@/modules/learningResourceSystem/externalResources/externalResource.service";
import { ArticlesRouter } from "../routes/v1/articles/article.route";
import { ArticlesHttpController } from "../routes/v1/articles/article.controller";
import { ArticleService } from "@/modules/publicationSystem/articles/article.service";
import { RewardsRouter } from "../routes/v1/rewards/reward.route";
import { RewardsHttpController } from "../routes/v1/rewards/reward.controller";
import { RewardService } from "@/modules/rewardsSystem/rewards/reward.service";
import { StudyJamsRouter } from "../routes/v1/studyJams/studyJam.route";
import { StudyJamsHttpController } from "../routes/v1/studyJams/studyJam.controller";
import { StudyJamService } from "@/modules/learningResourceSystem/studyJams/studyJam.service";
import { TeamService } from "@/modules/teamsSystem/teams/team.service";
import { TeamsHttpController } from "../routes/v1/teams/team.controller";
import { TeamsRouter } from "../routes/v1/teams/team.route";
import { MembersRouter } from "../routes/v1/teams/members/member.route";
import { MembersHttpController as TeamMembersHttpController } from "../routes/v1/teams/members/member.controller";
import { MemberService as TeamMembersService } from "@/modules/teamsSystem/members/member.service";
import { UsersRouter } from "../routes/v1/users/user.route";
import { UsersHttpController } from "../routes/v1/users/user.controller";
import { UserService } from "@/modules/userSystem/users/user.service";
import { CertificatesRouter } from "../routes/v1/users/certificates/certificate.route";
import { CertificatesHttpController } from "../routes/v1/users/certificates/certificate.controller";
import { CertificateService } from "@/modules/userResourceSystem/certificates/certificate.service";
import { PointsRouter } from "../routes/v1/users/points/points.route";
import { PointsHttpController } from "../routes/v1/users/points/points.controller";
import { TransactionRouter } from "../routes/v1/users/points/transactions/transaction.route";
import { ProfilesRouter } from "../routes/v1/users/profiles/profile.route";
import { ProfilesHttpController } from "../routes/v1/users/profiles/profile.controller";
import { ProfileService } from "@/modules/userResourceSystem/profiles/profile.service";
import { ProjectsRouter } from "../routes/v1/users/projects/project.route";
import { SettingsRouter } from "../routes/v1/users/settings/settings.route";
import { SettingsHttpController } from "../routes/v1/users/settings/settings.controller";
import { SettingsService } from "@/modules/userResourceSystem/settings/settings.service";
import { AchievementsRouter } from "../routes/v1/users/achievements/achievement.route";
import { AchievementsHttpController } from "../routes/v1/users/achievements/achievement.controller";
import { AchievementService } from "@/modules/userResourceSystem/achievements/achievement.service";
import { ProjectsHttpController } from "../routes/v1/users/projects/project.controller";
import { ProjectService } from "@/modules/userResourceSystem/projects/project.service";
import { TransactionsHttpController } from "../routes/v1/users/points/transactions/transaction.controller";   
import { TransactionService } from "@/deprecated/walletSystem/transactions/transaction.service";
import { economySystemRouterInstance } from "@/deprecated";

export const routesLoader = (app: Express) => {
  ///////////////////////////////////////////////
  //
  // VERSION 1 ROUTES
  //
  ///////////////////////////////////////////////
  const docsRouter = new DocsRouter();

  const supabaseClient = supabase;
  const authMiddleware = authMiddlewareInstance;

  const filesHttpController = new FilesHttpController(filesModuleController);
  const filesRouter = new FilesRouter(filesHttpController);

  const authService = new AuthService(supabaseClient);
  const authHttpController = new AuthHttpController(authService);
  const authRouter = new AuthRouter(authHttpController);

  const eventService = new EventService();
  const attendanceService = new AttendanceService();
  const eventsHttpController = new EventsHttpController(
    eventService,
    attendanceService,
  );
  const eventsRouter = new EventsRouter(eventsHttpController, authMiddleware);

  const healthHttpController = new HealthHttpController();
  const healthRouter = new HealthRouter(healthHttpController);

  const learningResourceService = resourceServiceInstance;
  const learningResourcesHttpController = new LearningResourcesHttpController(
    learningResourceService,
  );
  const learningResourcesRouter = new LearningResourcesRouter(
    learningResourcesHttpController,
    authMiddleware,
  );

  const articlesService = new ArticleService();
  const articleshttpController = new ArticlesHttpController(articlesService);
  const articlesRouter = new ArticlesRouter(
    articleshttpController,
    authMiddleware,
  );

  const rewardService = new RewardService();
  const rewardsRouterController = new RewardsHttpController(rewardService);
  const rewardsRouter = new RewardsRouter(
    rewardsRouterController,
    authMiddleware,
  );

  const studyJamService = new StudyJamService();
  const studyJamsController = new StudyJamsHttpController(studyJamService);
  const studyJamsRouter = new StudyJamsRouter(
    studyJamsController,
    authMiddleware,
  );

  const teamsService = new TeamService();
  const teamsHttpController = new TeamsHttpController(teamsService);
  const memberService = new TeamMembersService();
  const membersHttpController = new TeamMembersHttpController(memberService);
  const membersRouter = new MembersRouter(membersHttpController);
  const teamsRouter = new TeamsRouter(
    teamsHttpController,
    authMiddleware,
    membersRouter,
  );

  const userService = new UserService();
  const usersHttpController = new UsersHttpController(userService);
  const achievementsService = new AchievementService();
  const achievementsHttpController = new AchievementsHttpController(
    achievementsService,
  );
  const achievementsRouter = new AchievementsRouter(
    achievementsHttpController,
    authMiddleware,
  );
  const certificateService = new CertificateService();
  const certificateHttpController = new CertificatesHttpController(
    certificateService,
  );
  const certificatesRouter = new CertificatesRouter(
    certificateHttpController,
    authMiddleware,
  );
  const transactionService = new TransactionService();
  const transactionHttpController=  new TransactionsHttpController(transactionService);
  const transactionRouter = new TransactionRouter(transactionHttpController);
  const pointsHttpController = new PointsHttpController();
  const pointsRouter = new PointsRouter(
    pointsHttpController,
    transactionRouter,
  );
  const profilesService = new ProfileService();
  const profilesHttpController = new ProfilesHttpController(profilesService);
  const profilesRouter = new ProfilesRouter(profilesHttpController);
  const projectsService = new ProjectService();
  const projectsHttpController = new ProjectsHttpController(projectsService);
  const projectsRouter = new ProjectsRouter(
    projectsHttpController,
    authMiddleware,
  );
  const settingsService = new SettingsService();
  const settingsHttpController = new SettingsHttpController(settingsService);
  const settingsRouter = new SettingsRouter(
    settingsHttpController,
    authMiddleware,
  );
  const usersRouter = new UsersRouter(
    usersHttpController,
    achievementsRouter,
    certificatesRouter,
    pointsRouter,
    profilesRouter,
    projectsRouter,
    settingsRouter,
  );

  const apiV1Router = new ApiVersion1Router(
    filesRouter,
    authRouter,
    eventsRouter,
    healthRouter,
    learningResourcesRouter,
    articlesRouter,
    rewardsRouter,
    studyJamsRouter,
    teamsRouter,
    usersRouter,
  );

  app.use("/api/v1", apiV1Router.router);

  app.use("/docs", docsRouter.router);

  ///////////////////////////////////////////////
  //
  // DEPRECATED ROUTES
  //
  ///////////////////////////////////////////////
  app.use(getDeprecationWarningInterceptor("v1"));

  app.use("/api/health", healthCheckModuleRouterInstance.getRouter());
  app.use("/api/user-resource-system", userResourceSystemRouter.getRouter());
  app.use("/api/economy-system", economySystemRouterInstance.getRouter());
  app.use("/api/user-system", userSystemRouterInstance.getRouter());
  app.use(
    "/api/publication-system",
    publicationSystemRouterInstance.getRouter(),
  );
  app.use("/api/event-system", eventSystemRouterInstance.getRouter());
  app.use("/api/team-system", teamSystemRouterInstance.getRouter());
  app.use("/api/reward-system", rewardSystemRouterInstance.getRouter());
  app.use(
    "/api/learning-resource-system",
    learningResourceSystemRouterInstance.getRouter(),
  );
  app.use("/api/rbac-system", rbacSystemRouterInstance.getRouter());
  app.use("/api/auth-system", authSystemRouterInstance.getRouter());
  app.use("/api/member-system", memberSystemRouterInstance.getRouter());
};
