import { createExpressController } from "@packages/api-typing";
import { nexusApiContract } from "@packages/nexus-api-contracts";

export class HealthCheckController {
  constructor() {}

  getHealthCheck = createExpressController(
    nexusApiContract.health.get,
    async ({ input, output, res, req }) => {
      return output(200, {
        status: "success",
        message: "Health check successful",
      });
    }
  );
}

export const healthCheckController = new HealthCheckController();
