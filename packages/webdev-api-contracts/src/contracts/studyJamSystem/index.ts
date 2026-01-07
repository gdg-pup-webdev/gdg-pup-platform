import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { studyJamRoutes } from "./studyJam.route.js";

export const studyJamSystemRoutes = createRoutes({
  studyJams: createRoute({
    path: "/study-jams",
    routes: studyJamRoutes,
  }),
});
