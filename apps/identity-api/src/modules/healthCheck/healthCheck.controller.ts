import { createExpressController } from "@packages/api-typing";
import { identityApiContract } from "@packages/identity-api-contracts";
import { RequestHandler } from "express";

export class HealthCheckController {
  constructor() {}

  getHealthCheck : RequestHandler = createExpressController(
    identityApiContract.health.get,
    async ({ input, output, res, req }) => {
      return output(200, {
        status: "success",
        message: "Identity API: Health check successful",
      });
    }
  );
}

export const healthCheckController = new HealthCheckController();
