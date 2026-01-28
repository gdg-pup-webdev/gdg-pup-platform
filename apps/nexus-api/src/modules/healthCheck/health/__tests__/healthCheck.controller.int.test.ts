/**
 * Health check controller integration test.
 *
 * This exercises the real Express app wiring to ensure `/api/health`
 * remains mounted correctly and returns the public contract payload.
 */
import request = require("supertest");
import { describe, expect, it } from "vitest";

import app from "../../../../app.js";
import { healthCheckExpectedPayload } from "../../__tests__/test-helpers.js";

describe("healthCheck.controller (integration)", () => {
  it("GET /api/health returns the expected success payload", async () => {
    // Use the actual app to validate route mounting + response contract.
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(healthCheckExpectedPayload);
  });
});
