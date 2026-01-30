import { expect } from "vitest";
import supertest = require("supertest");
import { Express } from "express";

export const testListEconomyResources = async (
  app: Express,
  endpoint: string,
  mockListFn: any,
  mockData: any,
  query: Record<string, string | number> = {},
  expectedArgs?: unknown[],
) => {
  mockListFn.mockResolvedValue({ list: [mockData], count: 1 });

  const response = await supertest(app).get(endpoint).query({
    pageNumber: 1,
    pageSize: 10,
    ...query,
  });

  if (expectedArgs) {
    expect(mockListFn).toHaveBeenCalledWith(...expectedArgs);
  }
  expect(response.status).toBe(200);
  expect(response.body.status).toBe("success");
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]).toEqual(mockData);
};
