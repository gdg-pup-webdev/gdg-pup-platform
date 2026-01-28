/**
 * Team controller integration tests.
 *
 * Uses the real Express app while mocking auth and the service layer to
 * validate routing and response contracts without DB access.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  listResult,
  teamFixture,
  teamsPagination,
} from "../../__tests__/test-helpers.js";

const teamsBasePath = "/api/team-system/teams";
const teamPath = (teamId: string) => `${teamsBasePath}/${teamId}`;

const { svcList, svcCreate, svcGet, svcUpdate, svcDelete } = vi.hoisted(() => ({
  svcList: vi.fn(),
  svcCreate: vi.fn(),
  svcGet: vi.fn(),
  svcUpdate: vi.fn(),
  svcDelete: vi.fn(),
}));

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth:
      () => (req: any, _res: any, next: any) => ((req.user = { id: "user-1" }), next()),
  },
  AuthMiddleware: class {},
}));

vi.mock("../team.service.js", () => ({
  teamServiceInstance: {
    listTeams: svcList,
    createTeam: svcCreate,
    getOneTeam: svcGet,
    updateTeam: svcUpdate,
    deleteTeam: svcDelete,
  },
  TeamService: class {},
}));

describe("team.controller (integration)", () => {
  beforeEach(() => {
    svcList.mockReset();
    svcCreate.mockReset();
    svcGet.mockReset();
    svcUpdate.mockReset();
    svcDelete.mockReset();
  });

  it("GET /api/team-system/teams returns list + meta", async () => {
    svcList.mockResolvedValue(listResult(teamFixture));

    const response = await request(app)
      .get(teamsBasePath)
      .query(teamsPagination);

    expect(response.status).toBe(200);
    expect(svcList).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
      status: "success",
      message: "Teams fetched successfully",
      data: [teamFixture],
      meta: {
        totalRecords: 1,
        currentPage: teamsPagination.pageNumber,
        pageSize: teamsPagination.pageSize,
        totalPages: 1,
      },
    });
  });

  it("POST /api/team-system/teams calls createTeam", async () => {
    svcCreate.mockResolvedValue(teamFixture);

    const response = await request(app).post(teamsBasePath).send({
      data: {
        name: teamFixture.name,
        description: teamFixture.description,
      },
    });

    expect(response.status).toBe(200);
    expect(svcCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: teamFixture.name }),
      "user-1",
    );
  });

  it("GET /api/team-system/teams/:teamId calls getOneTeam", async () => {
    svcGet.mockResolvedValue(teamFixture);

    const response = await request(app).get(teamPath(teamFixture.id));

    expect(response.status).toBe(200);
    expect(svcGet).toHaveBeenCalledWith(teamFixture.id);
  });

  it("PATCH /api/team-system/teams/:teamId calls updateTeam", async () => {
    svcUpdate.mockResolvedValue({ ...teamFixture, name: "Updated" });

    const response = await request(app)
      .patch(teamPath(teamFixture.id))
      .send({ data: { name: "Updated" } });

    expect(response.status).toBe(200);
    expect(svcUpdate).toHaveBeenCalledWith(
      teamFixture.id,
      expect.objectContaining({ name: "Updated" }),
    );
  });

  it("DELETE /api/team-system/teams/:teamId calls deleteTeam", async () => {
    svcDelete.mockResolvedValue(teamFixture);

    const response = await request(app).delete(teamPath(teamFixture.id));

    expect(response.status).toBe(200);
    expect(svcDelete).toHaveBeenCalledWith(teamFixture.id);
  });
});
