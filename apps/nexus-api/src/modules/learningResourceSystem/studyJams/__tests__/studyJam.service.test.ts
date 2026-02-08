/**
 * Study jam service unit tests.
 *
 * The repository is mocked to verify orchestration and RepositoryError
 * mapping without making any real Supabase calls.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import {
  learningResourcePagination,
  listResult,
  studyJamFilters,
  studyJamFixture,
} from "../../__tests__/test-helpers.js";
import { StudyJamService } from "../studyJam.service.js";

const { mockCreate, mockList, mockGetOne, mockUpdate, mockDelete } = vi.hoisted(
  () => ({
    mockCreate: vi.fn(),
    mockList: vi.fn(),
    mockGetOne: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
  }),
);

vi.mock("../studyJam.repository.js", () => ({
  studyJamRepositoryInstance: {
    create: mockCreate,
    list: mockList,
    getOne: mockGetOne,
    update: mockUpdate,
    delete: mockDelete,
  },
  StudyJamRepository: class {},
}));

describe("studyJam.service (unit)", () => {
  const service = new StudyJamService();

  beforeEach(() => {
    mockCreate.mockReset();
    mockList.mockReset();
    mockGetOne.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  it("create delegates to the repository", async () => {
    mockCreate.mockResolvedValue(studyJamFixture);

    const result = await service.create(
      { title: studyJamFixture.title } as any,
      "user-1",
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(studyJamFixture.id);
  });

  it("list delegates to the repository with pagination and filters", async () => {
    mockList.mockResolvedValue(listResult(studyJamFixture));

    const result = await service.list(
      learningResourcePagination.pageNumber,
      learningResourcePagination.pageSize,
      studyJamFilters,
    );

    expect(mockList).toHaveBeenCalledWith(
      learningResourcePagination.pageNumber,
      learningResourcePagination.pageSize,
      studyJamFilters,
    );
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
