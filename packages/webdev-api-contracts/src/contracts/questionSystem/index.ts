import { createRoutes } from "@packages/api-typing";

import { questionRoutes } from "./question.routes.js";

export const questionSystemRoutes = createRoutes({
  questions: {
    path: "/questions",
    routes: questionRoutes,
  },
});
