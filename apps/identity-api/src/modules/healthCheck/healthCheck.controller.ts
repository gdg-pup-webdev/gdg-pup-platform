import { createExpressController } from "@packages/api-typing";
import { identityApiContract } from "@packages/identity-api-contracts";

export class HealthCheckController {
  constructor() {}

  getHealthCheck = createExpressController(
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
