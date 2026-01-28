/**
 * Member controller integration tests.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  listResult,
  memberFixture,
  teamsPagination,
} from "../../__tests__/test-helpers.js";

const membersBasePath = "/api/team-system/members";
const memberPath = (memberId: string) => `${membersBasePath}/${memberId}`;

const { svcList, svcCreate, svcDelete } = vi.hoisted(() => ({
  svcList: vi.fn(),
  svcCreate: vi.fn(),
  svcDelete: vi.fn(),
}));

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth:
      () => (req: any, _res: any, next: any) => ((req.user = { id: "user-1" }), next()),
  },
  AuthMiddleware: class {},
}));

vi.mock("../member.service.js", () => ({
  memberServiceInstance: {
    listMembersWithFilter: svcList,
    createMember: svcCreate,
    deleteMember: svcDelete,
  },
  MemberService: class {},
}));

describe("member.controller (integration)", () => {
  beforeEach(() => {
    svcList.mockReset();
    svcCreate.mockReset();
    svcDelete.mockReset();
  });

  it("GET /api/team-system/members?teamId=... returns list + meta", async () => {
    svcList.mockResolvedValue(listResult(memberFixture));

    const response = await request(app)
      .get(membersBasePath)
      .query({ teamId: memberFixture.team_id, ...teamsPagination });

    expect(response.status).toBe(200);
    expect(svcList).toHaveBeenCalledWith(teamsPagination.pageNumber, teamsPagination.pageSize, {
      teamId: memberFixture.team_id,
      userId: undefined,
      role: undefined,
    });
    expect(response.body.meta).toMatchObject({
      totalRecords: 1,
      currentPage: teamsPagination.pageNumber,
      pageSize: teamsPagination.pageSize,
      totalPages: 1,
    });
  });

  it("POST /api/team-system/members calls createMember", async () => {
    svcCreate.mockResolvedValue(memberFixture);

    const response = await request(app).post(membersBasePath).send({
      data: {
        team_id: memberFixture.team_id,
        user_id: memberFixture.user_id,
        role: memberFixture.role,
      },
    });

    expect(response.status).toBe(200);
    expect(svcCreate).toHaveBeenCalledWith(
      expect.objectContaining({ team_id: memberFixture.team_id }),
    );
  });

  it("DELETE /api/team-system/members/:memberId calls deleteMember", async () => {
    svcDelete.mockResolvedValue(memberFixture);

    const response = await request(app).delete(memberPath(memberFixture.id));

    expect(response.status).toBe(200);
    expect(svcDelete).toHaveBeenCalledWith(memberFixture.id);
  });
});
