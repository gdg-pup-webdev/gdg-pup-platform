import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GdgMembersHttpController } from "../gdgmembers.controller";
import { GdgMembersRouter } from "../gdgmembers.router";
import { GdgMembersController } from "@/v1/modules/members";

vi.mock("@packages/nexus-api-contracts", () => ({
  contract: {
    api: {
      v1: {
        gdgmembers: {
          GET: {},
          POST: {},
          gdgId: {
            GET: {},
            PATCH: {},
            DELETE: {},
            profile_image: { POST: {} },
            suggested_users: { GET: {} },
            make_private: { POST: {} },
            make_public: { POST: {} },
            nfc_card: {
              GET: {},
              activate: { POST: {} },
            },
            roles: {
              GET: {},
              POST: {},
              roleName: { DELETE: {} },
            },
          },
        },
      },
    },
  },
}));

vi.mock("@packages/typed-rest/serverExpress", () => ({
  createExpressController:
    (_contract: unknown, handler: any) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      try {
        const response = await handler({
          input: {
            params: req.params,
            query: {
              ...req.query,
              pageNumber: Number(req.query.pageNumber),
              pageSize: Number(req.query.pageSize),
            },
            body: req.body,
            files: (req as express.Request & { files?: unknown }).files,
          },
          output: (status: number, body: unknown) => ({ status, body }),
        });

        res.status(response.status).json(response.body);
      } catch (error) {
        next(error);
      }
    },
}));

describe("GdgMembersRouter suggested-users route", () => {
  const getSuggestedUsers = vi.fn();
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
    getSuggestedUsers.mockReset();
  });

  const createApp = () => {
    const moduleController: Pick<GdgMembersController, "getSuggestedUsers"> = {
      getSuggestedUsers,
    };

    const controller = new GdgMembersHttpController(
      moduleController as unknown as GdgMembersController,
      {} as never,
    );

    const app = express();
    app.use("/gdgmembers", new GdgMembersRouter(controller).router);

    return app;
  };

  it("returns paginated suggested users for a member", async () => {
    getSuggestedUsers.mockResolvedValue({
      list: [similarUserPayload],
      count: 3,
    });

    const app = createApp();

    const response = await request(app)
      .get("/gdgmembers/GDG-1/suggested-users?pageNumber=2&pageSize=1")
      .expect(200);

    expect(getSuggestedUsers).toHaveBeenCalledWith(
      "GDG-1",
      2,
      1,
      "exploratory",
    );
    const { email, ...expectedPayload } = similarUserPayload;

    expect(response.body).toEqual({
      status: "success",
      message: "Suggested GDG members fetched successfully",
      data: [expectedPayload],
      meta: {
        currentPage: 2,
        pageSize: 1,
        totalRecords: 3,
        totalPages: 3,
      },
    });
  });

  it("returns an empty page when the module reports no suggested users", async () => {
    getSuggestedUsers.mockResolvedValue({ list: [], count: 0 });

    const app = createApp();

    const response = await request(app)
      .get("/gdgmembers/GDG-1/suggested-users?pageNumber=1&pageSize=10")
      .expect(200);

    expect(getSuggestedUsers).toHaveBeenCalledWith(
      "GDG-1",
      1,
      10,
      "exploratory",
    );
    expect(response.body.meta).toEqual({
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
    });
    expect(response.body.data).toEqual([]);
  });

  it("uses the mixed exploratory strategy by default", async () => {
    getSuggestedUsers.mockResolvedValue({
      list: [similarUserPayload],
      count: 1,
    });

    const app = createApp();

    const response = await request(app)
      .get("/gdgmembers/GDG-1/suggested-users?pageNumber=1&pageSize=10")
      .expect(200);

    expect(getSuggestedUsers).toHaveBeenCalledWith(
      "GDG-1",
      1,
      10,
      "exploratory",
    );
    expect(response.body.message).toBe(
      "Suggested GDG members fetched successfully",
    );
    const { email, ...expectedPayload } = similarUserPayload;
    expect(response.body.data).toEqual([expectedPayload]);
  });
});
