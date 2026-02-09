/**
 * Study jam controller integration tests.
 *
 * We exercise the real Express app via supertest while mocking auth and
 * the service layer to keep tests fast and schema-safe.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  learningResourcePagination,
  listResult,
  studyJamFilterQuery,
  studyJamFilters,
  studyJamFixture,
} from "../../__tests__/test-helpers.js";
import { resetCrudMocks } from "../../__tests__/controller-test-utils.js";

const studyJamBasePath = "/api/learning-resource-system/study-jams";
const studyJamPath = (id: string) => `${studyJamBasePath}/${id}`;

const { sjList, sjCreate, sjGetOne, sjUpdate, sjDelete } = vi.hoisted(() => ({
  sjList: vi.fn(),
  sjCreate: vi.fn(),
  sjGetOne: vi.fn(),
  sjUpdate: vi.fn(),
  sjDelete: vi.fn(),
}));

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth: () => (req: any, _res: any, next: any) => (
      (req.user = { id: "user-1" }),
      next()
    ),
  },
  AuthMiddleware: class {},
}));

vi.mock("../studyJam.service.js", () => ({
  resourceServiceInstance: {
    list: sjList,
    create: sjCreate,
    getOne: sjGetOne,
    update: sjUpdate,
    delete: sjDelete,
  },
  StudyJamService: class {},
}));

describe("studyJam.controller (integration)", () => {
  beforeEach(() => {
    resetCrudMocks({
      mockList: sjList,
      mockCreate: sjCreate,
      mockGetOne: sjGetOne,
      mockUpdate: sjUpdate,
      mockDelete: sjDelete,
    });
  });

  it("GET /api/learning-resource-system/study-jams returns list + meta", async () => {
    sjList.mockResolvedValue({
      list: [studyJamFixture],
      count: 5,
    });

    const response = await request(app).get(studyJamBasePath).query({
      pageNumber: 2,
      pageSize: 2,
    });

    expect(response.status).toBe(200);
    expect(sjList).toHaveBeenCalledWith(2, 2, {});
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toMatchObject({
      totalRecords: 5,
      currentPage: 2,
      pageSize: 2,
      totalPages: 3,
    });
  });

  it("GET /api/learning-resource-system/study-jams forwards filters to service", async () => {
    sjList.mockResolvedValue(listResult(studyJamFixture));

    const response = await request(app)
      .get(studyJamBasePath)
      .query({
        ...learningResourcePagination,
        ...studyJamFilterQuery,
      });

    expect(response.status).toBe(200);
    expect(sjList).toHaveBeenCalledWith(
      learningResourcePagination.pageNumber,
      learningResourcePagination.pageSize,
      studyJamFilters,
    );
  });

  it("POST /api/learning-resource-system/study-jams calls create with user id", async () => {
    sjCreate.mockResolvedValue(studyJamFixture);

    const response = await request(app)
      .post(studyJamBasePath)
      .send({
        data: {
          title: studyJamFixture.title,
          description: studyJamFixture.description,
          recording_url: studyJamFixture.recording_url,
          summary: studyJamFixture.summary,
        },
      });

    expect(response.status).toBe(200);
    expect(sjCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: studyJamFixture.title,
        recording_url: studyJamFixture.recording_url,
      }),
      "user-1",
    );
  });

  it("GET /api/learning-resource-system/study-jams/:studyJamId calls getOne", async () => {
    sjGetOne.mockResolvedValue(studyJamFixture);

    const response = await request(app).get(studyJamPath(studyJamFixture.id));

    expect(response.status).toBe(200);
    expect(sjGetOne).toHaveBeenCalledWith(studyJamFixture.id);
  });

  it("PATCH /api/learning-resource-system/study-jams/:studyJamId calls update", async () => {
    sjUpdate.mockResolvedValue({ ...studyJamFixture, title: "Updated" });

    const response = await request(app)
      .patch(studyJamPath(studyJamFixture.id))
      .send({ data: { title: "Updated" } });

    expect(response.status).toBe(200);
    expect(sjUpdate).toHaveBeenCalledWith(
      studyJamFixture.id,
      expect.objectContaining({ title: "Updated" }),
    );
  });

  it("DELETE /api/learning-resource-system/study-jams/:studyJamId calls delete", async () => {
    sjDelete.mockResolvedValue(studyJamFixture);

    const response = await request(app).delete(
      studyJamPath(studyJamFixture.id),
    );

    expect(response.status).toBe(200);
    expect(sjDelete).toHaveBeenCalledWith(studyJamFixture.id);
  });
});
