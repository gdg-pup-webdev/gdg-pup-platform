import { Router } from "express";
import { HealthHttpController } from "./healthCheck.controller.js";

export class HealthRouter {
  router: Router;

  constructor(private readonly controller: HealthHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.getHealthCheck);
  }
}
