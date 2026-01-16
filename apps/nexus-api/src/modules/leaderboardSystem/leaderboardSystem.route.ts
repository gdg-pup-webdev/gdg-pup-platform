import { Router } from "express";

export class LeaderboardSystemRouter {
  constructor() {}

  getRouter() {
    const router : Router = Router();

    router.get("/wallets", (req, res) => {});

    return router;
  }
}

export const leaderboardSystemRouterInstance = new LeaderboardSystemRouter();
