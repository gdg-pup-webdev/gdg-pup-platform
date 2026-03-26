import { describe, expect, it, beforeEach } from "vitest";
import { AddTeamMember } from "../useCases/AddTeamMember";
import {
  MockTeamMemberRepository,
  MockTeamRepository,
  MockUserRepository,
} from "../infrastructure/MockRepositories";
import { buildTeam } from "./test-helpers";

describe("AddTeamMember", () => {
  let memberRepo: MockTeamMemberRepository;
  let teamRepo: MockTeamRepository;
  let userRepo: MockUserRepository;
  let useCase: AddTeamMember;

  beforeEach(() => {
    memberRepo = new MockTeamMemberRepository();
    teamRepo = new MockTeamRepository();
    userRepo = new MockUserRepository();
    useCase = new AddTeamMember(memberRepo, teamRepo, userRepo);
  });

  it("adds a member when the team and user exist", async () => {
    teamRepo.teams = [buildTeam({ id: "team-1" })];
    userRepo.users = [{ id: "user-1" }];

    const result = await useCase.execute({
      teamId: "team-1",
      gdgId: "user-1",
      role: "Lead",
    });

    expect(result.props.id).toBeTruthy();
    expect(result.props.teamId).toBe("team-1");
    expect(result.props.gdgId).toBe("user-1");
    expect(memberRepo.members).toHaveLength(1);
  });

  it("throws when the team does not exist", async () => {
    userRepo.users = [{ id: "user-1" }];

    await expect(
      useCase.execute({
        teamId: "missing-team",
        gdgId: "user-1",
        role: "Lead",
      }),
    ).rejects.toThrow(
      "Cannot add member: Team with ID missing-team not found.",
    );
  });
});
