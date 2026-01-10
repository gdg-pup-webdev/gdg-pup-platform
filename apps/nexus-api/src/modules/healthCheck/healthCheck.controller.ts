import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";
// import { nexusApiContract } from "@packages/nexus-api-contracts";

export class HealthCheckController {
  constructor() {}

  getHealthCheck = createExpressController(
    Contract.health.get,
    async ({ input, output, res, req }) => {
      
      return output(200, {
        status: "success",
        message: "Nexus API: Health check successful",
      });
    }
  );
}

export const healthCheckController = new HealthCheckController();
