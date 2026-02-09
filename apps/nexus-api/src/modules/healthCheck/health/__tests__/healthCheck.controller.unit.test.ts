/**
 * Health check controller unit test.
 *
 * This calls the handler directly with a minimal response double to
 * validate the controller's HTTP contract without app boot or routing.
 */
import { describe, expect, it, vi } from "vitest";

import { healthCheckController } from "../healthCheck.controller.js";
import { healthCheckExpectedPayload } from "../../__tests__/test-helpers.js";

describe("healthCheck.controller (unit)", () => {
  it("returns 200 with the expected payload", async () => {
    // Response double: enough surface area for the controller to respond.
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json } as unknown as Parameters<
      typeof healthCheckController.getHealthCheck
    >[1];

    await healthCheckController.getHealthCheck({} as never, res, () => {});

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(healthCheckExpectedPayload);
  });
});
