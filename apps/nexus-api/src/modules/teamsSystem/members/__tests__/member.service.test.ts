/**
 * Member service unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import { listResult, memberFixture } from "../../__tests__/test-helpers.js";
import { MemberService } from "../member.service.js";

const { repoList, repoCreate, repoDelete } = vi.hoisted(() => ({
  repoList: vi.fn(),
  repoCreate: vi.fn(),
  repoDelete: vi.fn(),
}));

vi.mock("../member.repository.js", () => ({
  memberRepositoryInstance: {
    listMembersWithFilter: repoList,
    createMember: repoCreate,
    deleteMember: repoDelete,
  },
  MemberRepository: class {},
}));

describe("member.service (unit)", () => {
  const service = new MemberService();

  beforeEach(() => {
    repoList.mockReset();
    repoCreate.mockReset();
    repoDelete.mockReset();
  });

  it("listMembersWithFilter delegates to the repository", async () => {
    repoList.mockResolvedValue(listResult(memberFixture));

    const result = await service.listMembersWithFilter(1, 10, {
      teamId: memberFixture.team_id,
    });

    expect(repoList).toHaveBeenCalledWith(1, 10, {
      teamId: memberFixture.team_id,
    });
    expect(result.count).toBe(1);
  });

  it("createMember delegates to the repository", async () => {
    repoCreate.mockResolvedValue(memberFixture);

    const result = await service.createMember(memberFixture as any);

    expect(repoCreate).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(memberFixture.id);
  });

  it("deleteMember delegates to the repository", async () => {
    repoDelete.mockResolvedValue(memberFixture);

    await service.deleteMember(memberFixture.id);

    expect(repoDelete).toHaveBeenCalledWith(memberFixture.id);
  });

  // it("maps repository errors to RepositoryError-shaped failures", async () => {
  //   repoList.mockRejectedValue(new DatabaseError("db failure"));

  //   await expect(service.listMembersWithFilter(1, 10, {})).rejects.toMatchObject({
  //     title: "Database Error",
  //     statusCode: 500,
  //   });
  // });
});
