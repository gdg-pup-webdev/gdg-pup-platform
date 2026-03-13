import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { PortfoliosHttpController } from "./portfolios.controller";

export class PortfoliosRouter {
  router: Router;

  constructor(
    private readonly portfoliosHttpController: PortfoliosHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get(
      "/",
      this.authMiddleware.requirePermissions({ portfolios: ["read"] }),
      this.portfoliosHttpController.listPortfolios,
    );

    this.router.get(
      "/:portfolioId",
      this.authMiddleware.requirePermissions({ portfolios: ["read"] }),
      this.portfoliosHttpController.getPortfolioById,
    );

    this.router.patch(
      "/:portfolioId",
      this.authMiddleware.requirePermissions({ portfolios: ["update"] }),
      this.portfoliosHttpController.updatePortfolioProperty,
    );
  }
}
