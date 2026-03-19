import { describe, expect, it, beforeEach } from "vitest";
import { UpdateTeam } from "../useCases/UpdateTeam";
import { MockTeamRepository } from "../infrastructure/MockRepositories";
import { buildTeam } from "./test-helpers";

describe("UpdateTeam", () => {
  let repo: MockTeamRepository;
  let useCase: UpdateTeam;

  beforeEach(() => {
    repo = new MockTeamRepository();
    useCase = new UpdateTeam(repo);
  });

  it("updates responsibilities and parent team id", async () => {
    repo.teams = [buildTeam({ id: "team-1", responsibilities: null })];

    const result = await useCase.execute("team-1", {
      responsibilities: "Updated responsibilities",
      parentTeamId: "parent-2",
    });

    expect(result.props.responsibilities).toBe("Updated responsibilities");
    expect(result.props.parentTeamId).toBe("parent-2");
  });

  it("preserves existing fields when patch data is partial", async () => {
    repo.teams = [
      buildTeam({
        id: "team-2",
        name: "Operations",
        description: "Runs the chapter",
        responsibilities: "Process management",
      }),
    ];

    const result = await useCase.execute("team-2", {
      description: "Runs chapter operations",
    });

    expect(result.props.name).toBe("Operations");
    expect(result.props.description).toBe("Runs chapter operations");
    expect(result.props.responsibilities).toBe("Process management");
  });
});
