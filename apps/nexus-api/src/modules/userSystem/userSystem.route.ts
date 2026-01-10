import { Router } from "express";

export class UserSystemRouter {
  constructor() {}

  getRouter() {
    const router = Router();

    router.get("/:userId", (req, res) => {});
    router.get("/:userId/wallet", (req, res) => {});
    router.get("/:userId/wallet/transactions", (req, res) => {});
    router.get("/:userId/roles", (req, res) => {});
    router.get("/:userId/profile", (req, res) => {});

    router.get("/:userId/projects", (req, res) => {}); 
    
    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
