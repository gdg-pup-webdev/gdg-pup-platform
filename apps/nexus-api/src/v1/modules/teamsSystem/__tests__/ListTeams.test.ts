import { describe, expect, it, beforeEach } from "vitest";
import { ListTeams } from "../useCases/ListTeams";
import { MockTeamRepository } from "../infrastructure/MockRepositories";
import { buildTeam } from "./test-helpers";

describe("ListTeams", () => {
  let repo: MockTeamRepository;
  let useCase: ListTeams;

  beforeEach(() => {
    repo = new MockTeamRepository();
    useCase = new ListTeams(repo);
  });

  it("returns paginated teams", async () => {
    repo.teams = [
      buildTeam({ id: "team-1", name: "Alpha" }),
      buildTeam({ id: "team-2", name: "Beta" }),
      buildTeam({ id: "team-3", name: "Gamma" }),
    ];

    const result = await useCase.execute(2, 1);

    expect(result.count).toBe(3);
    expect(result.list).toHaveLength(1);
    expect(result.list[0]?.props.name).toBe("Beta");
  });

  it("guards invalid pagination values", async () => {
    repo.teams = [buildTeam({ id: "team-1" })];

    const result = await useCase.execute(0, 0);

    expect(result.count).toBe(1);
    expect(result.list).toHaveLength(1);
  });
});
