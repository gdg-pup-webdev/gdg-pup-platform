/**
 * @file test-helpers.ts
 * @description Shared HTTP test helpers for the event system module. Helpers
 * keep controller integration tests concise while remaining DB-safe via mocks.
 */
import { expect } from "vitest";
import supertest = require("supertest");
import { Express } from "express";

export const testListEndpoint = async (
  app: Express,
  endpoint: string,
  mockListFn: any,
  mockItem: any,
  query: Record<string, string | number> = {},
) => {
  mockListFn.mockResolvedValue({ list: [mockItem], count: 1 });

  const response = await supertest(app).get(endpoint).query({
    pageNumber: 1,
    pageSize: 10,
    ...query,
  });

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("success");
  expect(response.body.data).toHaveLength(1);
};
