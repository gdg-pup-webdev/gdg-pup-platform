import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class HealthHttpController {
  constructor() {}

  getHealthCheck: RequestHandler = createExpressController(
    contract.api.health.GET,
    async ({ input, output, ctx }) => {
      return output(200, {
        status: "success",
        message: "Nexus API: Health check successful",
      });
    },
  );
} 