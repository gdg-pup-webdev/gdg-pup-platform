/**
 * External resource controller integration tests.
 *
 * These tests hit the real Express app via supertest while mocking the
 * service layer and auth middleware. This validates routing, request
 * branching, and response contracts without touching the database.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  externalResourceFixture,
  learningResourcePagination,
  listResult,
} from "../../__tests__/test-helpers.js";
import { resetCrudMocks } from "../../__tests__/controller-test-utils.js";

const { mockList, mockCreate, mockGetOne, mockUpdate, mockDelete } =
  vi.hoisted(() => ({ mockList: vi.fn(), mockCreate: vi.fn(), mockGetOne: vi.fn(), mockUpdate: vi.fn(), mockDelete: vi.fn() }));

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth:
      () => (req: any, _res: any, next: any) => ((req.user = { id: "user-1" }), next()),
  },
  AuthMiddleware: class {},
}));

vi.mock("../externalResource.service.js", () => ({
  resourceServiceInstance: { list: mockList, create: mockCreate, getOne: mockGetOne, update: mockUpdate, delete: mockDelete },
  ExternalResourceService: class {},
}));

describe("externalResource.controller (integration)", () => {
  beforeEach(() => {
    resetCrudMocks({ mockList, mockCreate, mockGetOne, mockUpdate, mockDelete });
  });

  it("GET /api/learning-resource-system/external-resources returns list + meta", async () => {
    mockList.mockResolvedValue(listResult(externalResourceFixture));

    const response = await request(app)
      .get("/api/learning-resource-system/external-resources")
      .query(learningResourcePagination);

    expect(response.status).toBe(200);
    expect(mockList).toHaveBeenCalledTimes(1);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toMatchObject({
      totalRecords: 1,
      currentPage: learningResourcePagination.pageNumber,
      pageSize: learningResourcePagination.pageSize,
      totalPages: 1,
    });
  });

  it("POST /api/learning-resource-system/external-resources calls create with user id", async () => {
    mockCreate.mockResolvedValue(externalResourceFixture);

    const response = await request(app)
      .post("/api/learning-resource-system/external-resources")
      .send({
        data: {
          title: externalResourceFixture.title,
          description: externalResourceFixture.description,
          resource_url: externalResourceFixture.resource_url,
        },
      });

    expect(response.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: externalResourceFixture.title,
        resource_url: externalResourceFixture.resource_url,
      }),
      "user-1",
    );
  });

  it("GET /api/learning-resource-system/external-resources/:externalResourceId calls getOne", async () => {
    mockGetOne.mockResolvedValue(externalResourceFixture);

    const response = await request(app).get(
      `/api/learning-resource-system/external-resources/${externalResourceFixture.id}`,
    );

    expect(response.status).toBe(200);
    expect(mockGetOne).toHaveBeenCalledWith(externalResourceFixture.id);
    expect(response.body.data.id).toBe(externalResourceFixture.id);
  });

  it("PATCH /api/learning-resource-system/external-resources/:externalResourceId calls update", async () => {
    mockUpdate.mockResolvedValue({
      ...externalResourceFixture,
      title: "Updated title",
    });

    const response = await request(app)
      .patch(
        `/api/learning-resource-system/external-resources/${externalResourceFixture.id}`,
      )
      .send({ data: { title: "Updated title" } });

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      externalResourceFixture.id,
      expect.objectContaining({ title: "Updated title" }),
    );
  });

  it("DELETE /api/learning-resource-system/external-resources/:externalResourceId calls delete", async () => {
    mockDelete.mockResolvedValue(externalResourceFixture);

    const response = await request(app).delete(
      `/api/learning-resource-system/external-resources/${externalResourceFixture.id}`,
    );

    expect(response.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith(externalResourceFixture.id);
  });
});
