/**
 * @file file.controller.test.ts
 * @description HTTP-level integration tests for the filesSystem controller.
 * These tests hit the real Express app via supertest while mocking auth and
 * the service layer to keep the suite deterministic and DB-safe.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../../../app.js";
import {
  createListResult,
  createTestFile,
} from "../../__tests__/test-helpers.js";

const { mockFileService } = vi.hoisted(() => ({
  mockFileService: {
    list: vi.fn(),
    create: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

/**
 * Auth is mocked to inject a stable req.user so controller handlers can
 * exercise the "authenticated" paths without depending on token parsing.
 */
vi.mock("@/middlewares/auth.middleware.js", () => ({
  AuthMiddleware: class {
    requireAuth() {
      return (req: any, _res: any, next: any) => {
        req.user = { id: "user-1" };
        next();
      };
    }
  },
  authMiddlewareInstance: {
    requireAuth: () => (req: any, _res: any, next: any) => {
      req.user = { id: "user-1" };
      next();
    },
  },
}));

/**
 * The service layer is mocked so these tests validate only the HTTP contract:
 * routing, branch selection, and response shape.
 */
vi.mock("@/modules/filesSystem/files/file.service.js", () => ({
  FileService: class {
    list = mockFileService.list;
    create = mockFileService.create;
    getOne = mockFileService.getOne;
    update = mockFileService.update;
    delete = mockFileService.delete;
  },
  fileServiceInstance: mockFileService,
}));

/**
 * Controller integration tests:
 * - Hit the real Express app via supertest
 * - Mock dependencies to keep the tests DB-safe and deterministic
 */
describe("FileController routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/file-system/files returns list + meta", async () => {
    const files = [createTestFile()];
    mockFileService.list.mockResolvedValue(createListResult(files));

    const res = await request(app).get("/api/file-system/files");

    expect(res.status).toBe(200);
    expect(mockFileService.list).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 10,
    });
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.totalRecords).toBe(1);
  });

  it("POST /api/file-system/files calls create with user", async () => {
    const created = createTestFile({ id: "file-2" });
    mockFileService.create.mockResolvedValue(created);

    const res = await request(app)
      .post("/api/file-system/files")
      .send({ data: { name: "New File" } });

    expect(res.status).toBe(200);
    expect(mockFileService.create).toHaveBeenCalledWith(
      { name: "New File" },
      "user-1",
    );
    expect(res.body.data.id).toBe("file-2");
  });

  it("GET /api/file-system/files/:fileId returns one", async () => {
    const file = createTestFile({ id: "file-3" });
    mockFileService.getOne.mockResolvedValue(file);

    const res = await request(app).get("/api/file-system/files/file-3");

    expect(res.status).toBe(200);
    expect(mockFileService.getOne).toHaveBeenCalledWith("file-3");
    expect(res.body.data.id).toBe("file-3");
  });

  it("PATCH /api/file-system/files/:fileId updates", async () => {
    const file = createTestFile({ id: "file-4", name: "Updated" });
    mockFileService.update.mockResolvedValue(file);

    const res = await request(app)
      .patch("/api/file-system/files/file-4")
      .send({ data: { name: "Updated" } });

    expect(res.status).toBe(200);
    expect(mockFileService.update).toHaveBeenCalledWith("file-4", {
      name: "Updated",
    });
    expect(res.body.data.name).toBe("Updated");
  });

  it("DELETE /api/file-system/files/:fileId deletes", async () => {
    const file = createTestFile({ id: "file-5" });
    mockFileService.delete.mockResolvedValue(file);

    const res = await request(app).delete("/api/file-system/files/file-5");

    expect(res.status).toBe(200);
    expect(mockFileService.delete).toHaveBeenCalledWith("file-5");
    expect(res.body.data.id).toBe("file-5");
  });
});
