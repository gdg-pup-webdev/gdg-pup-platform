import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GdgMembersHttpController } from "../gdgmembers.controller";
import { GdgMembersRouter } from "../gdgmembers.router";

describe("GdgMembersRouter similar-users route", () => {
  const getSimilarUsers = vi.fn();
  const similarUserPayload = {
    gdgId: "GDG-2",
    displayName: "Second User",
    email: "second@example.com",
    membershipType: null,
    avatarUrl: null,
    program: null,
    yearLevel: null,
    department: null,
    firstName: "Second",
    middleName: null,
    lastName: "User",
    suffix: null,
    bio: null,
    githubUrl: null,
    linkedinUrl: null,
    portfolioWebsiteUrl: null,
    otherLinks: [],
    technicalSkills: [],
    learningInterests: [],
    toolsAndTechnologies: [],
    isPublic: true,
  };

  beforeEach(() => {
    getSimilarUsers.mockReset();
  });

  const createApp = () => {
    const moduleController = {
      getSimilarUsers,
    } as unknown as GdgMembersHttpController["moduleController"];

    const controller = new GdgMembersHttpController(
      moduleController,
      {} as never,
    );

    const app = express();
    app.use("/gdgmembers", new GdgMembersRouter(controller).router);

    return app;
  };

  it("returns paginated similar users for a member", async () => {
    getSimilarUsers.mockResolvedValue({
      list: [similarUserPayload],
      count: 3,
    });

    const app = createApp();

    const response = await request(app)
      .get("/gdgmembers/GDG-1/similar-users?pageNumber=2&pageSize=1")
      .expect(200);

    expect(getSimilarUsers).toHaveBeenCalledWith("GDG-1", 2, 1, "relevant");
    expect(response.body).toEqual({
      status: "success",
      message: "Similar GDG members fetched successfully",
      data: [similarUserPayload],
      meta: {
        currentPage: 2,
        pageSize: 1,
        totalRecords: 3,
        totalPages: 3,
      },
    });
  });

  it("returns an empty page when the module reports no similar users", async () => {
    getSimilarUsers.mockResolvedValue({ list: [], count: 0 });

    const app = createApp();

    const response = await request(app)
      .get("/gdgmembers/GDG-1/similar-users?pageNumber=1&pageSize=10")
      .expect(200);

    expect(getSimilarUsers).toHaveBeenCalledWith("GDG-1", 1, 10, "relevant");
    expect(response.body.meta).toEqual({
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
    });
    expect(response.body.data).toEqual([]);
  });

  it("passes exploratory strategy to module controller", async () => {
    getSimilarUsers.mockResolvedValue({
      list: [similarUserPayload],
      count: 1,
    });

    const app = createApp();

    await request(app)
      .get(
        "/gdgmembers/GDG-1/similar-users?pageNumber=1&pageSize=10&strategy=exploratory",
      )
      .expect(200);

    expect(getSimilarUsers).toHaveBeenCalledWith("GDG-1", 1, 10, "exploratory");
  });
});
