import { Express, RequestHandler } from "express";
import { healthCheckRouterInstance } from "../modules/healthCheck/healthCheck.route.js";
import { leaderboardSystemRouterInstance } from "@/modules/leaderboardSystem/leaderboardSystem.route.js";
import { userSystemRouterInstance } from "@/modules/userSystem/userSystem.route.js";
import { articleRouterInstance } from "@/modules/articleSystem/articleSystem.route.js";
import { eventSystemRouterInstance } from "@/modules/eventSystem/eventSystem.route.js";
import { resourceSystemRouterInstance } from "@/modules/resourceSystem/resourceSystem.route.js";
import { walletServiceInstance } from "@/modules/economySystem/wallet.service.js";
import { userResourceSystemRouterInstance } from "@/modules/userResourceSystem/userResourceSystem.route.js";

export const routesLoader = (app: Express) => {
  app.use("/api/article-system", articleRouterInstance.getRouter());
  app.use("/api/event-system", eventSystemRouterInstance.getRouter());
  app.use("/api/health", healthCheckRouterInstance.getRouter());
  app.use("/api/leaderboard-system", leaderboardSystemRouterInstance.getRouter());
  app.use("/api/resource-system", resourceSystemRouterInstance.getRouter());
  app.use("/api/user-system", userSystemRouterInstance.getRouter());
  app.use(
    "/api/user-resource-system",
    userResourceSystemRouterInstance.getRouter()
  );

  /**
   * TESTING ROUTES
   */
  app.use("/api/test/testauth", checkTokens);
  app.use("/api/test", checkTokens);
};

/**
 * call wallet increment points to check if transaction side effects are working
 */
// const testIncrementWalletPoints: RequestHandler = async (req, res) => {
//   const { data, error } = await walletServiceInstance.incrementPoints(
//     "f2758768-142d-4231-afdb-e65fe4f19f35",
//     50,
//     "test_source",
//     "test_id"
//   );
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   return res.status(200).json({ data });
// };

/**
 * check parsed tokens
 */
const checkTokens: RequestHandler = async (req, res) => {
  const supabaseToken = req.supabaseAccessToken;
  const googleToken = req.googleAccessToken;
  return res.status(200).json({ supabaseToken, googleToken });
};
