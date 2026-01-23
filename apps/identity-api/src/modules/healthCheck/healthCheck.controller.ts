import { contract } from "@packages/identity-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class HealthCheckController {
  constructor() {}

  getHealthCheck: RequestHandler = createExpressController(
    contract.api.health.GET,
    async ({ input, output, ctx }) => {
      return output(200, {
        status: "success",
        message: "Identity API: Health check successful",
      });
    },
  );
}

export const healthCheckController = new HealthCheckController();
