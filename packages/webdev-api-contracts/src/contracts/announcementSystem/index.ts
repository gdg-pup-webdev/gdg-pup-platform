import { createRoute, createRoutes } from "@packages/api-typing";
import { announcementRoutes } from "./announcement.route.js";

export const announcementSystemRoutes = createRoutes({
  announcements: createRoute({
    path: "/study-jams",
    routes: announcementRoutes,
  }),
});
