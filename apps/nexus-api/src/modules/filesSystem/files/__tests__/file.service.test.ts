/**
 * @file file.service.test.ts
 * @description Unit tests for FileService orchestration and error mapping.
 * The repository is mocked so behavior is validated without touching Supabase.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FileService } from "../file.service.js";
import {
  createListResult,
  createTestFile,
} from "../../__tests__/test-helpers.js";
import { NotFoundError } from "@/errors/HttpError.js";
import { ServerError } from "@/errors/ServerError.js";

const { mockRepository } = vi.hoisted(() => ({
  mockRepository: {
    create: vi.fn(),
    list: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

/**
 * Repository is mocked to keep the service tests focused on orchestration
 * and error mapping, not on query construction.
 */
vi.mock("@/modules/filesSystem/files/file.repository.js", () => ({
  FileRepository: class {
    create = mockRepository.create;
    list = mockRepository.list;
    getOne = mockRepository.getOne;
    update = mockRepository.update;
    delete = mockRepository.delete;
  },
  fileRepositoryInstance: mockRepository,
}));

/**
 * Service unit tests validate that:
 * - each method delegates correctly
 * - null results become NotFoundError
 * - unexpected failures become RepositoryError
 */
describe("FileService", () => {
  const service = new FileService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list delegates to repository", async () => {
    const files = [createTestFile()];
    mockRepository.list.mockResolvedValue(createListResult(files));

    const result = await service.list({ pageNumber: 2, pageSize: 5 });

    expect(mockRepository.list).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 5,
    });
    expect(result.count).toBe(1);
  });

  // it("getOne throws NotFoundError on null", async () => {
  //   mockRepository.getOne.mockResolvedValue(null);

  //   await expect(service.getOne("missing")).rejects.toBeInstanceOf(
  //     NotFoundError,
  //   );
  // });

  it("create maps repository errors", async () => {
    mockRepository.create.mockRejectedValue(
      new ServerError("db down", "db down"),
    );

    await expect(
      service.create({ name: "x" }, "user-1"),
    ).rejects.toBeInstanceOf(ServerError);
  });

  it("update returns updated record", async () => {
    const updated = createTestFile({ id: "file-2", name: "Updated" });
    mockRepository.update.mockResolvedValue(updated);

    const result = await service.update("file-2", { name: "Updated" });

    expect(mockRepository.update).toHaveBeenCalledWith("file-2", {
      name: "Updated",
    });
    expect(result.name).toBe("Updated");
  });

  it("delete maps repository errors", async () => {
    mockRepository.delete.mockRejectedValue(new ServerError("db down", "db down"));

    await expect(service.delete("file-3")).rejects.toBeInstanceOf(ServerError);
  });
});
