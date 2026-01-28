/**
 * Reward controller integration tests.
 *
 * These hit the real Express app while mocking auth and the service layer
 * to validate routing, contracts, and response meta safely.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  claimResultFixture,
  listResult,
  rewardFixture,
  rewardsPagination,
} from "../../__tests__/test-helpers.js";

const rewardsBasePath = "/api/reward-system/rewards";
const rewardPath = (rewardId: string) => `${rewardsBasePath}/${rewardId}`;
const rewardClaimPath = (rewardId: string) => `${rewardPath(rewardId)}/claim`;

const { svcList, svcCreate, svcGet, svcClaim } = vi.hoisted(() => ({
  svcList: vi.fn(),
  svcCreate: vi.fn(),
  svcGet: vi.fn(),
  svcClaim: vi.fn(),
}));

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth:
      () => (req: any, _res: any, next: any) => ((req.user = { id: "user-1" }), next()),
  },
  AuthMiddleware: class {},
}));

vi.mock("../reward.service.js", () => ({
  rewardServiceInstance: {
    listRewardsByPage: svcList,
    createReward: svcCreate,
    getReward: svcGet,
    claimReward: svcClaim,
  },
  RewardService: class {},
}));

describe("reward.controller (integration)", () => {
  beforeEach(() => {
    svcList.mockReset();
    svcCreate.mockReset();
    svcGet.mockReset();
    svcClaim.mockReset();
  });

  it("GET /api/reward-system/rewards returns list + meta", async () => {
    svcList.mockResolvedValue(listResult(rewardFixture));

    const response = await request(app)
      .get(rewardsBasePath)
      .query(rewardsPagination);

    expect(response.status).toBe(200);
    expect(svcList).toHaveBeenCalledWith(
      rewardsPagination.pageNumber,
      rewardsPagination.pageSize,
    );
    expect(response.body).toMatchObject({
      status: "success",
      message: "Rewards fetched successfully.",
      data: [rewardFixture],
      meta: {
        totalRecords: 1,
        currentPage: rewardsPagination.pageNumber,
        pageSize: rewardsPagination.pageSize,
        totalPages: 1,
      },
    });
  });

  it("POST /api/reward-system/rewards calls createReward with req.user.id", async () => {
    svcCreate.mockResolvedValue(rewardFixture);

    const response = await request(app).post(rewardsBasePath).send({
      data: {
        title: rewardFixture.title,
        description: rewardFixture.description,
        user_id: rewardFixture.user_id,
        value: rewardFixture.value,
      },
    });

    expect(response.status).toBe(200);
    expect(svcCreate).toHaveBeenCalledWith(
      expect.objectContaining({ title: rewardFixture.title }),
      "user-1",
    );
  });

  it("GET /api/reward-system/rewards/:rewardId calls getReward", async () => {
    svcGet.mockResolvedValue(rewardFixture);

    const response = await request(app).get(rewardPath(rewardFixture.id));

    expect(response.status).toBe(200);
    expect(svcGet).toHaveBeenCalledWith(rewardFixture.id);
  });

  it("POST /api/reward-system/rewards/:rewardId/claim calls claimReward", async () => {
    svcClaim.mockResolvedValue(claimResultFixture);

    const response = await request(app).post(rewardClaimPath(rewardFixture.id));

    expect(response.status).toBe(200);
    expect(svcClaim).toHaveBeenCalledWith(rewardFixture.id);
    expect(response.body.data.updatedReward.id).toBe(rewardFixture.id);
  });
});
