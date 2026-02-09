/**
 * Team service unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import { listResult, teamFixture } from "../../__tests__/test-helpers.js";
import { TeamService } from "../team.service.js";

const { repoCreate, repoList, repoGet, repoUpdate, repoDelete } = vi.hoisted(() => ({
  repoCreate: vi.fn(),
  repoList: vi.fn(),
  repoGet: vi.fn(),
  repoUpdate: vi.fn(),
  repoDelete: vi.fn(),
}));

vi.mock("../team.repository.js", () => ({
  teamRepositoryInstance: {
    createTeam: repoCreate,
    listTeams: repoList,
    getOneTeam: repoGet,
    updateTeam: repoUpdate,
    deleteTeam: repoDelete,
  },
  TeamRepository: class {},
}));

describe("team.service (unit)", () => {
  const service = new TeamService();

  beforeEach(() => {
    repoCreate.mockReset();
    repoList.mockReset();
    repoGet.mockReset();
    repoUpdate.mockReset();
    repoDelete.mockReset();
  });

  it("listTeams delegates to the repository", async () => {
    repoList.mockResolvedValue(listResult(teamFixture));

    const result = await service.listTeams();

    expect(repoList).toHaveBeenCalledTimes(1);
    expect(result.count).toBe(1);
  });

  it("createTeam delegates to the repository", async () => {
    repoCreate.mockResolvedValue(teamFixture);

    const result = await service.createTeam(teamFixture as any, "user-1");

    expect(repoCreate).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(teamFixture.id);
  });

  it("getOneTeam delegates to the repository", async () => {
    repoGet.mockResolvedValue(teamFixture);

    const result = await service.getOneTeam(teamFixture.id);

    expect(repoGet).toHaveBeenCalledWith(teamFixture.id);
    expect(result.id).toBe(teamFixture.id);
  });

  it("updateTeam delegates to the repository", async () => {
    repoUpdate.mockResolvedValue({ ...teamFixture, name: "Updated" });

    await service.updateTeam(teamFixture.id, { name: "Updated" } as any);

    expect(repoUpdate).toHaveBeenCalledWith(
      teamFixture.id,
      expect.objectContaining({ name: "Updated" }),
    );
  });

  it("deleteTeam delegates to the repository", async () => {
    repoDelete.mockResolvedValue(teamFixture);

    await service.deleteTeam(teamFixture.id);

    expect(repoDelete).toHaveBeenCalledWith(teamFixture.id);
  });

  // it("maps repository errors to RepositoryError-shaped failures", async () => {
  //   repoList.mockRejectedValue(new DatabaseError("db failure"));

  //   await expect(service.listTeams()).rejects.toMatchObject({
  //     title: "Database Error",
  //     statusCode: 500,
  //   });
  // });
});
