/**
 * External resource service unit tests.
 *
 * The repository is mocked to validate orchestration (e.g., uploader_id
 * enrichment) and error mapping to RepositoryError without DB access.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { externalResourceFixture, listResult } from "../../__tests__/test-helpers.js";
import { ExternalResourceService } from "../externalResource.service.js";

const { mockCreate, mockList, mockGetOne, mockUpdate, mockDelete } = vi.hoisted(
  () => ({
    mockCreate: vi.fn(),
    mockList: vi.fn(),
    mockGetOne: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
  }),
);

vi.mock("../externalResource.repository.js", () => ({
  externalResourceRepositoryInstance: {
    create: mockCreate,
    list: mockList,
    getOne: mockGetOne,
    update: mockUpdate,
    delete: mockDelete,
  },
  ExternalResourceRepository: class {},
}));

describe("externalResource.service (unit)", () => {
  const service = new ExternalResourceService();

  beforeEach(() => {
    mockCreate.mockReset();
    mockList.mockReset();
    mockGetOne.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  it("create enriches uploader_id before calling the repository", async () => {
    mockCreate.mockResolvedValue(externalResourceFixture);

    await service.create({ title: externalResourceFixture.title } as any, "user-1");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ uploader_id: "user-1" }),
    );
  });

  it("list delegates to the repository", async () => {
    mockList.mockResolvedValue(listResult(externalResourceFixture));

    const result = await service.list();

    expect(mockList).toHaveBeenCalledTimes(1);
    expect(result.count).toBe(1);
  });

  it("maps repository errors to RepositoryError", async () => {
    mockCreate.mockRejectedValue(new DatabaseError("db failure"));

    await expect(
      service.create({ title: "bad" } as any, "user-1"),
    ).rejects.toMatchObject({
      title: "Database Error",
      statusCode: 500,
    });
  });
});
