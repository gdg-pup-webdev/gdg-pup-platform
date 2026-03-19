import { describe, expect, it, beforeEach } from "vitest";
import { CreateTeam } from "../useCases/CreateTeam";
import { MockTeamRepository } from "../infrastructure/MockRepositories";

describe("CreateTeam", () => {
  let repo: MockTeamRepository;
  let useCase: CreateTeam;

  beforeEach(() => {
    repo = new MockTeamRepository();
    useCase = new CreateTeam(repo);
  });

  it("creates a team with responsibilities and parent team id", async () => {
    const result = await useCase.execute({
      name: "Engineering",
      description: "Builds platform features.",
      responsibilities: "Architecture and delivery",
      parentTeamId: "team-parent",
    });

    expect(result.props.id).toBeTruthy();
    expect(result.props.name).toBe("Engineering");
    expect(result.props.responsibilities).toBe("Architecture and delivery");
    expect(result.props.parentTeamId).toBe("team-parent");
    expect(repo.teams).toHaveLength(1);
  });

  it("normalizes omitted optional fields to null", async () => {
    const result = await useCase.execute({
      name: "Community",
      description: "Owns outreach.",
      responsibilities: null,
      parentTeamId: null,
    });

    expect(result.props.responsibilities).toBeNull();
    expect(result.props.parentTeamId).toBeNull();
  });
});
