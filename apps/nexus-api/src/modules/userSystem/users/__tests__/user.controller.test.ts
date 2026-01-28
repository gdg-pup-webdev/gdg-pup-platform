/**
 * User controller integration tests.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  userAggregateFixture,
  userFixture,
} from "../../__tests__/test-helpers.js";

const usersBasePath = "/api/user-system/users";
const userPath = (userId: string) => `${usersBasePath}/${userId}`;
const userAggregatePath = (userId: string) => `${userPath(userId)}/aggregate`;

const { svcList, svcGet, svcAggregate } = vi.hoisted(() => ({
  svcList: vi.fn(),
  svcGet: vi.fn(),
  svcAggregate: vi.fn(),
}));

vi.mock("../user.service.js", () => ({
  userServiceInstance: {
    listUsers: svcList,
    getUserById: svcGet,
    getUserAggregate: svcAggregate,
  },
  UserService: class {},
}));

describe("user.controller (integration)", () => {
  beforeEach(() => {
    svcList.mockReset();
    svcGet.mockReset();
    svcAggregate.mockReset();
  });

  it("GET /api/user-system/users returns the user list", async () => {
    svcList.mockResolvedValue([userFixture]);

    const response = await request(app).get(usersBasePath);

    expect(response.status).toBe(200);
    expect(svcList).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
      status: "success",
      message: "Users fetched successfully",
      data: [userFixture],
    });
  });

  it("GET /api/user-system/users/:userId returns a single user", async () => {
    svcGet.mockResolvedValue(userFixture);

    const response = await request(app).get(userPath(userFixture.id));

    expect(response.status).toBe(200);
    expect(svcGet).toHaveBeenCalledWith(userFixture.id);
    expect(response.body.data.id).toBe(userFixture.id);
  });

  it("GET /api/user-system/users/:userId/aggregate maps relations to contract names", async () => {
    svcAggregate.mockResolvedValue(userAggregateFixture);

    const response = await request(app).get(userAggregatePath(userFixture.id));

    expect(response.status).toBe(200);
    expect(svcAggregate).toHaveBeenCalledWith(userFixture.id);
    expect(response.body.data.wallets).toHaveLength(1);
    expect(response.body.data.profiles).toHaveLength(1);
    expect(response.body.data.projects).toHaveLength(1);
    expect(response.body.data.achievements).toHaveLength(1);
    expect(response.body.data.certificates).toHaveLength(1);
    expect(response.body.data.settings).toHaveLength(1);
  });
});
