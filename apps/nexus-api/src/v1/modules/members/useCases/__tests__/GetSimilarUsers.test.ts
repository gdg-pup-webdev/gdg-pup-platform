import { beforeEach, describe, expect, it, vi } from "vitest";
import { GdgMember, GdgMemberProps } from "../../domain/GdgMember";
import { IGdgMemberRepository } from "../../domain/IGdgMemberRepository";
import { GetSimilarUsers } from "../GetSimilarUsers";

const createMember = (
  gdgId: string,
  overrides: Partial<GdgMemberProps> = {},
): GdgMember =>
  GdgMember.hydrate({
    gdgId,
    email: `${gdgId.toLowerCase()}@example.com`,
    membershipType: "student",
    avatarUrl: null,
    avatarUrl64: null,
    avatarUrl512: null,
    program: "BSIT",
    yearLevel: 2,
    department: "CCIS",
    displayName: gdgId,
    firstName: gdgId,
    middleName: null,
    lastName: "Member",
    suffix: null,
    bio: null,
    githubUrl: null,
    linkedinUrl: null,
    portfolioWebsiteUrl: null,
    otherLinks: [],
    technicalSkills: ["typescript", "react"],
    learningInterests: ["backend"],
    toolsAndTechnologies: ["nodejs"],
    sectionOrder: ["customButtons", "skillsAndInterests", "projects", "gdgImpact", "badges"],
    isOnboarded: true,
    isPublic: true,
    ...overrides,
  });

describe("GetSimilarUsers", () => {
  const sourceMember = createMember("GDG-SELF", { displayName: "Self Member" });
  const similarMembers = [
    createMember("GDG-01", { displayName: "Alpha" }),
    createMember("GDG-02", { displayName: "Bravo" }),
    createMember("GDG-03", { displayName: "Charlie" }),
  ];
  const randomPool = [
    createMember("GDG-SELF", { displayName: "Self Duplicate" }),
    createMember("GDG-04", { displayName: "Delta", program: "BSCS" }),
    createMember("GDG-05", { displayName: "Echo", department: "Engineering" }),
    createMember("GDG-06", { displayName: "Foxtrot", yearLevel: 4 }),
    createMember("GDG-07", { displayName: "Golf", technicalSkills: ["python"] }),
    createMember("GDG-08", { displayName: "Hotel", learningInterests: ["mobile"] }),
    createMember("GDG-09", { displayName: "India", toolsAndTechnologies: ["docker"] }),
    createMember("GDG-10", { displayName: "Juliet", program: "BSCpE" }),
    createMember("GDG-11", { displayName: "Kilo", department: "Applied Math" }),
    createMember("GDG-12", { displayName: "Lima", yearLevel: 1 }),
  ];

  let repo: IGdgMemberRepository;
  let useCase: GetSimilarUsers;

  beforeEach(() => {
    repo = {
      findByGdgId: vi.fn().mockResolvedValue(sourceMember),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      findSimilarMembersBasedOnField: vi
        .fn()
        .mockResolvedValue({ list: similarMembers, count: similarMembers.length }),
      listRandomMembers: vi
        .fn()
        .mockResolvedValue({ list: randomPool, count: randomPool.length }),
      findPublicMembersExcludingGdgId: vi.fn(),
      findPublicMembersWithSameProgramOrDepartmentExcludingGdgId: vi.fn(),
      findPublicMembersWithSameYearLevelExcludingGdgId: vi.fn(),
      findPublicSimilarMembersExcludingGdgId: vi.fn(),
      saveNew: vi.fn(),
      persistUpdates: vi.fn(),
      deleteByGdgId: vi.fn(),
      getHighestIdNumberForYear: vi.fn(),
      search: vi.fn(),
    };
    useCase = new GetSimilarUsers(repo);
  });

  it("rotates exploratory suggestions between requests", async () => {
    const first = await useCase.execute("GDG-SELF", 1, 3, "exploratory");
    const second = await useCase.execute("GDG-SELF", 1, 3, "exploratory");

    const firstIds = first.list.map((member) => member.props.gdgId);
    const secondIds = second.list.map((member) => member.props.gdgId);

    expect(firstIds).not.toEqual(secondIds);
    expect(firstIds).not.toContain("GDG-SELF");
    expect(secondIds).not.toContain("GDG-SELF");
  });

  it("keeps relevant strategy stable for the same inputs", async () => {
    const first = await useCase.execute("GDG-SELF", 1, 3, "relevant");
    const second = await useCase.execute("GDG-SELF", 1, 3, "relevant");

    const firstIds = first.list.map((member) => member.props.gdgId);
    const secondIds = second.list.map((member) => member.props.gdgId);

    expect(firstIds).toEqual(secondIds);
  });
});
