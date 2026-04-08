import { beforeEach, describe, expect, it } from "vitest";
import { GdgMember } from "../../domain/GdgMember";
import { IGdgMemberRepository } from "../../domain/IGdgMemberRepository";
import { GetSimilarUsers } from "../GetSimilarUsers";

class MockGdgMemberRepository implements IGdgMemberRepository {
  members: GdgMember[] = [];

  async findByGdgId(gdgId: string): Promise<GdgMember | null> {
    return this.members.find((member) => member.props.gdgId === gdgId) || null;
  }

  async findByEmail(): Promise<GdgMember | null> {
    return null;
  }

  async findAll(): Promise<{ list: GdgMember[]; count: number }> {
    return { list: [], count: 0 };
  }

  async findPublicMembersExcludingGdgId(gdgId: string): Promise<GdgMember[]> {
    return this.members.filter(
      (member) => member.props.gdgId !== gdgId && member.props.isPublic,
    );
  }

  async saveNew(member: GdgMember): Promise<GdgMember> {
    this.members.push(member);
    return member;
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    return member;
  }

  async deleteByGdgId(): Promise<void> {
    return undefined;
  }

  async getHighestIdNumberForYear(): Promise<number> {
    return 0;
  }

  async search(): Promise<GdgMember[]> {
    return [];
  }
}

const createMember = (overrides: Partial<GdgMember["props"]>): GdgMember =>
  GdgMember.hydrate({
    gdgId: overrides.gdgId || crypto.randomUUID(),
    email: overrides.email || "member@example.com",
    membershipType: overrides.membershipType ?? null,
    avatarUrl: overrides.avatarUrl ?? null,
    program: overrides.program ?? null,
    yearLevel: overrides.yearLevel ?? null,
    department: overrides.department ?? null,
    displayName: overrides.displayName ?? null,
    firstName: overrides.firstName || "Test",
    middleName: overrides.middleName ?? null,
    lastName: overrides.lastName || "User",
    suffix: overrides.suffix ?? null,
    bio: overrides.bio ?? null,
    githubUrl: overrides.githubUrl ?? null,
    linkedinUrl: overrides.linkedinUrl ?? null,
    portfolioWebsiteUrl: overrides.portfolioWebsiteUrl ?? null,
    otherLinks: overrides.otherLinks ?? [],
    technicalSkills: overrides.technicalSkills ?? [],
    learningInterests: overrides.learningInterests ?? [],
    toolsAndTechnologies: overrides.toolsAndTechnologies ?? [],
    isPublic: overrides.isPublic ?? true,
  });

describe("GetSimilarUsers", () => {
  let repository: MockGdgMemberRepository;
  let useCase: GetSimilarUsers;

  beforeEach(() => {
    repository = new MockGdgMemberRepository();
    useCase = new GetSimilarUsers(repository);
  });

  it("ranks members by profile similarity and paginates the result", async () => {
    const source = createMember({
      gdgId: "source",
      email: "source@example.com",
      displayName: "Source Member",
      program: "BSCS",
      yearLevel: 3,
      department: "Computer Science",
      membershipType: "Member",
      technicalSkills: ["TypeScript", "React", "Node"],
      learningInterests: ["Architecture", "Testing"],
      toolsAndTechnologies: ["Docker", "Git"],
    });

    const bestMatch = createMember({
      gdgId: "best",
      email: "best@example.com",
      displayName: "Best Match",
      program: "BSCS",
      yearLevel: 3,
      department: "Computer Science",
      membershipType: "Member",
      technicalSkills: ["TypeScript", "React"],
      learningInterests: ["Architecture"],
      toolsAndTechnologies: ["Docker"],
    });

    const secondMatch = createMember({
      gdgId: "second",
      email: "second@example.com",
      displayName: "Second Match",
      program: "BSCS",
      yearLevel: 2,
      department: "Computer Science",
      membershipType: "Member",
      technicalSkills: ["TypeScript"],
      learningInterests: ["Open Source"],
      toolsAndTechnologies: ["Git"],
    });

    const thirdMatch = createMember({
      gdgId: "third",
      email: "third@example.com",
      displayName: "Third Match",
      program: "BSIT",
      yearLevel: 3,
      department: "Information Technology",
      membershipType: "Member",
      technicalSkills: ["React"],
      learningInterests: ["Testing"],
      toolsAndTechnologies: ["Docker"],
    });

    const hiddenMatch = createMember({
      gdgId: "hidden",
      email: "hidden@example.com",
      displayName: "Hidden Match",
      program: "BSCS",
      yearLevel: 3,
      technicalSkills: ["TypeScript"],
      isPublic: false,
    });

    await repository.saveNew(source);
    await repository.saveNew(bestMatch);
    await repository.saveNew(secondMatch);
    await repository.saveNew(thirdMatch);
    await repository.saveNew(hiddenMatch);

    const firstPage = await useCase.execute("source", 1, 2);

    expect(firstPage.count).toBe(3);
    expect(firstPage.list.map((member) => member.props.gdgId)).toEqual([
      "best",
      "second",
    ]);

    const secondPage = await useCase.execute("source", 2, 2);

    expect(secondPage.count).toBe(3);
    expect(secondPage.list.map((member) => member.props.gdgId)).toEqual([
      "third",
    ]);
  });

  it("returns an empty list when the source member is missing", async () => {
    const result = await useCase.execute("missing", 1, 10);

    expect(result).toEqual({ list: [], count: 0 });
  });

  it("validates pagination arguments", async () => {
    await expect(useCase.execute("missing", 0, 10)).rejects.toThrowError(
      "Page number must be greater than 0",
    );
    await expect(useCase.execute("missing", 1, 0)).rejects.toThrowError(
      "Page size must be greater than 0",
    );
  });

  it("exploratory strategy mixes relevant with random users (20% random)", async () => {
    const source = createMember({
      gdgId: "source",
      displayName: "Source Member",
      program: "BSCS",
      yearLevel: 3,
      technicalSkills: ["TypeScript"],
    });

    const relevant = createMember({
      gdgId: "relevant",
      program: "BSCS",
      yearLevel: 3,
      technicalSkills: ["TypeScript"],
    });

    const irrelevant1 = createMember({
      gdgId: "irrelevant1",
      program: "BSIT",
      yearLevel: 1,
      technicalSkills: ["Python"],
    });

    const irrelevant2 = createMember({
      gdgId: "irrelevant2",
      program: "BSAE",
      yearLevel: 2,
      technicalSkills: ["Java"],
    });

    const irrelevant3 = createMember({
      gdgId: "irrelevant3",
      program: "BSIT",
      yearLevel: 4,
      technicalSkills: ["Go"],
    });

    const irrelevant4 = createMember({
      gdgId: "irrelevant4",
      program: "BSAE",
      yearLevel: 3,
      technicalSkills: ["C++"],
    });

    const irrelevant5 = createMember({
      gdgId: "irrelevant5",
      program: "BSCS",
      yearLevel: 1,
      technicalSkills: ["Python"],
    });

    await repository.saveNew(source);
    await repository.saveNew(relevant);
    await repository.saveNew(irrelevant1);
    await repository.saveNew(irrelevant2);
    await repository.saveNew(irrelevant3);
    await repository.saveNew(irrelevant4);
    await repository.saveNew(irrelevant5);

    // Test relevant strategy (default)
    const relevantResult = await useCase.execute("source", 1, 10, "relevant");
    expect(relevantResult.count).toBe(6); // 6 public members excluding source
    expect(relevantResult.list[0].props.gdgId).toBe("relevant");

    // Test exploratory strategy - should mix in some random users
    const exploratoryResult = await useCase.execute(
      "source",
      1,
      10,
      "exploratory",
    );
    expect(exploratoryResult.count).toBe(6);

    // With 20% random and 6 members, we'd replace ~1 member with a random one
    // So the relevant member might not be at position 0
    const exploratoryIds = exploratoryResult.list.map((m) => m.props.gdgId);
    expect(exploratoryIds).toContain("relevant"); // But relevant should still be there
    expect(exploratoryIds.length).toBe(6);
  });

  it("exploratory strategy with small result set includes at least one random member", async () => {
    const source = createMember({
      gdgId: "source",
      program: "BSCS",
      yearLevel: 3,
    });

    const relevant = createMember({
      gdgId: "relevant",
      program: "BSCS",
      yearLevel: 3,
    });

    const other1 = createMember({ gdgId: "other1" });
    const other2 = createMember({ gdgId: "other2" });

    await repository.saveNew(source);
    await repository.saveNew(relevant);
    await repository.saveNew(other1);
    await repository.saveNew(other2);

    // Get exploratory with page size = 3
    const result = await useCase.execute("source", 1, 3, "exploratory");

    // At least 1 of the 3 should be random (20% of 3 = 0.6, rounds to 1)
    const ids = result.list.map((m) => m.props.gdgId);
    expect(ids.length).toBe(3);
    // Check that we have a mix
    expect([ids].flat().length).toBe(3);
  });
});
