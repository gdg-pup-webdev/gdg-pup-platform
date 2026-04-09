import { beforeEach, describe, expect, it } from "vitest";
import { GdgMember } from "../../domain/GdgMember";
import { IGdgMemberRepository } from "../../domain/IGdgMemberRepository";
import { GetSimilarUsers } from "../GetSimilarUsers";
import { NotFoundError } from "@/v1/errors/HttpError";

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

  async findPublicMembersWithSameProgramOrDepartmentExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
    },
  ): Promise<GdgMember[]> {
    const { program, department } = filters;
    return this.members.filter((member) => {
      if (member.props.gdgId === gdgId || !member.props.isPublic) return false;
      const sameProgram = Boolean(program && member.props.program === program);
      const sameDepartment = Boolean(
        department && member.props.department === department,
      );
      return sameProgram || sameDepartment;
    });
  }

  async findPublicMembersWithSameYearLevelExcludingGdgId(
    gdgId: string,
    yearLevel: number | null,
  ): Promise<GdgMember[]> {
    if (yearLevel === null) return [];

    return this.members.filter(
      (member) =>
        member.props.gdgId !== gdgId &&
        member.props.isPublic &&
        member.props.yearLevel === yearLevel,
    );
  }

  async findPublicMembersWithDifferentProgramAndDepartmentExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
    },
  ): Promise<GdgMember[]> {
    const { program, department } = filters;

    return this.members.filter((member) => {
      if (member.props.gdgId === gdgId || !member.props.isPublic) return false;
      const differentProgram = program
        ? member.props.program !== program
        : true;
      const differentDepartment = department
        ? member.props.department !== department
        : true;

      return differentProgram && differentDepartment;
    });
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
      program: null,
      yearLevel: null,
      department: "Cloud Solutions",
      technicalSkills: [],
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

  it("throws when the source member is missing", async () => {
    const promise = useCase.execute("missing", 1, 10);
    await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    await expect(promise).rejects.toMatchObject({
      detail: "Member not found for gdgId: missing",
    });
  });

  it("validates pagination arguments", async () => {
    await expect(useCase.execute("missing", 0, 10)).rejects.toThrowError(
      "Page number must be greater than 0",
    );
    await expect(useCase.execute("missing", 1, 0)).rejects.toThrowError(
      "Page size must be greater than 0",
    );
  });

  it("exploratory strategy keeps deterministic 80/20 mix", async () => {
    const source = createMember({
      gdgId: "source",
      displayName: "Source Member",
      program: "BSCS",
      yearLevel: 3,
      department: "Web Development",
      technicalSkills: ["TypeScript"],
    });

    const similarA = createMember({
      gdgId: "similar-a",
      program: "BSCS",
      yearLevel: 3,
      department: "Web Development",
      technicalSkills: ["TypeScript"],
    });

    const similarB = createMember({
      gdgId: "similar-b",
      program: "BSCS",
      yearLevel: 1,
      department: "Web Development",
      technicalSkills: ["Python"],
    });

    const nonSimilarA = createMember({
      gdgId: "non-similar-a",
      program: null,
      yearLevel: 2,
      department: "Cloud Solutions",
      technicalSkills: ["Kubernetes"],
      learningInterests: ["IoT"],
      toolsAndTechnologies: ["Terraform"],
    });

    const nonSimilarB = createMember({
      gdgId: "non-similar-b",
      program: "BSAE",
      yearLevel: 4,
      department: "Cybersecurity",
      technicalSkills: ["Rust"],
      learningInterests: ["Blue Team"],
      toolsAndTechnologies: ["Wireshark"],
    });

    await repository.saveNew(source);
    await repository.saveNew(similarA);
    await repository.saveNew(similarB);
    await repository.saveNew(nonSimilarA);
    await repository.saveNew(nonSimilarB);

    const relevantResult = await useCase.execute("source", 1, 10, "relevant");
    const exploratoryResult = await useCase.execute(
      "source",
      1,
      10,
      "exploratory",
    );

    const exploratoryIds = exploratoryResult.list.map((m) => m.props.gdgId);
    const relevantIds = relevantResult.list.map((m) => m.props.gdgId);

    expect(relevantResult.count).toBe(2);
    expect(relevantIds).toEqual(["similar-a", "similar-b"]);

    expect(exploratoryResult.count).toBe(4);
    expect(exploratoryIds[0]).toBe("similar-a");
    expect(exploratoryIds[1]).toBe("similar-b");
    expect(exploratoryIds).toContain("similar-a");
    expect(exploratoryIds).toContain("similar-b");
    expect(exploratoryIds).toContain("non-similar-a");
    expect(exploratoryIds).toContain("non-similar-b");
  });

  it("exploratory strategy returns page unchanged when no outside candidates exist", async () => {
    const source = createMember({ gdgId: "source" });
    const other = createMember({ gdgId: "other" });

    await repository.saveNew(source);
    await repository.saveNew(other);

    const result = await useCase.execute("source", 1, 1, "exploratory");

    expect(result.count).toBe(1);
    expect(result.list.map((m) => m.props.gdgId)).toEqual(["other"]);
  });

  it("relevant strategy excludes cross-domain candidates without shared anchors", async () => {
    const source = createMember({
      gdgId: "source",
      program: "BS in Information Technology",
      department: "Web Development",
      technicalSkills: ["TypeScript", "React"],
    });

    const sameDomain = createMember({
      gdgId: "same-domain",
      program: "BSIT",
      department: "Web Development",
      technicalSkills: ["React"],
    });

    const broadOnly = createMember({
      gdgId: "broad-only",
      program: null,
      department: "Cloud Solutions",
      technicalSkills: [""],
      learningInterests: [""],
      toolsAndTechnologies: [""],
    });

    await repository.saveNew(source);
    await repository.saveNew(sameDomain);
    await repository.saveNew(broadOnly);

    const relevantResult = await useCase.execute("source", 1, 10, "relevant");
    const exploratoryResult = await useCase.execute(
      "source",
      1,
      10,
      "exploratory",
    );

    expect(relevantResult.list.map((m) => m.props.gdgId)).toEqual([
      "same-domain",
    ]);
    expect(relevantResult.count).toBe(1);

    expect(exploratoryResult.list.map((m) => m.props.gdgId)).toContain(
      "broad-only",
    );
    expect(exploratoryResult.count).toBe(2);
  });

  it("exploratory strategy is still public-only", async () => {
    const source = createMember({
      gdgId: "source",
      isPublic: true,
      department: "Web Development",
      technicalSkills: ["TypeScript"],
    });
    const publicSimilar = createMember({
      gdgId: "public-similar",
      isPublic: true,
      department: "Web Development",
      technicalSkills: ["TypeScript"],
    });
    const privateCandidate = createMember({
      gdgId: "private-candidate",
      isPublic: false,
      department: "Cloud Solutions",
    });

    await repository.saveNew(source);
    await repository.saveNew(publicSimilar);
    await repository.saveNew(privateCandidate);

    const relevant = await useCase.execute("source", 1, 10, "relevant");
    const exploratory = await useCase.execute("source", 1, 10, "exploratory");

    expect(relevant.count).toBe(1);
    expect(relevant.list.map((m) => m.props.gdgId)).toEqual(["public-similar"]);

    expect(exploratory.count).toBe(1);
    expect(exploratory.list.map((m) => m.props.gdgId)).toEqual([
      "public-similar",
    ]);
  });

  it("relevant strategy excludes private candidates", async () => {
    const source = createMember({
      gdgId: "source",
      department: "Web Development",
      technicalSkills: ["TypeScript"],
      isPublic: true,
    });
    const privateRelevant = createMember({
      gdgId: "private-relevant",
      department: "Web Development",
      technicalSkills: ["TypeScript"],
      isPublic: false,
    });

    await repository.saveNew(source);
    await repository.saveNew(privateRelevant);

    const relevant = await useCase.execute("source", 1, 10, "relevant");

    expect(relevant.count).toBe(0);
    expect(relevant.list.map((m) => m.props.gdgId)).toEqual([]);
  });

  it("exploratory strategy caps the pool size to 15", async () => {
    const source = createMember({
      gdgId: "source",
      program: "BSCS",
      department: "Web Development",
      yearLevel: 3,
    });

    await repository.saveNew(source);

    for (let index = 1; index <= 30; index += 1) {
      await repository.saveNew(
        createMember({
          gdgId: `candidate-${index}`,
          isPublic: true,
          program: index <= 20 ? "BSCS" : "BSIT",
          department: index <= 20 ? "Web Development" : "Cloud Solutions",
          yearLevel: index % 4,
        }),
      );
    }

    const pageOne = await useCase.execute("source", 1, 10, "exploratory");
    const pageTwo = await useCase.execute("source", 2, 10, "exploratory");

    expect(pageOne.count).toBe(15);
    expect(pageOne.list).toHaveLength(10);
    expect(pageTwo.list).toHaveLength(5);
  });

  it("exploratory strategy tops up pool from other public members", async () => {
    const source = createMember({
      gdgId: "source",
      program: "BSCS",
      department: "Web Development",
      yearLevel: 3,
      isPublic: true,
    });

    await repository.saveNew(source);

    for (let index = 1; index <= 2; index += 1) {
      await repository.saveNew(
        createMember({
          gdgId: `relevant-${index}`,
          program: "BSCS",
          department: "Web Development",
          yearLevel: 3,
          isPublic: true,
        }),
      );
    }

    for (let index = 1; index <= 20; index += 1) {
      await repository.saveNew(
        createMember({
          gdgId: `fallback-${index}`,
          program: "BS in Applied Math",
          department: "Data Science",
          yearLevel: 1,
          isPublic: true,
        }),
      );
    }

    const result = await useCase.execute("source", 1, 20, "exploratory");

    expect(result.count).toBe(15);
    expect(result.list).toHaveLength(15);
    expect(result.list.map((m) => m.props.gdgId)).toContain("relevant-1");
    expect(result.list.map((m) => m.props.gdgId)).toContain("relevant-2");
  });
});
