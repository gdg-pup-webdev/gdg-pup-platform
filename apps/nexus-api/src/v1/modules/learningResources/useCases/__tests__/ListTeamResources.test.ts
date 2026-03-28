import { describe, expect, it, beforeEach } from "vitest";
import { ListTeamResources } from "../ListTeamResources";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";

describe("ListTeamResources Use Case", () => {
  let repo: MockTeamResourceRepository;
  let useCase: ListTeamResources;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    useCase = new ListTeamResources(repo);
  });

  const setupData = async () => {
    const data = [
      { title: "React Guide", teamName: "Web", resourceType: "article" },
      { title: "Node Guide", teamName: "API", resourceType: "video" },
      { title: "Design Patterns", teamName: "Web", resourceType: "video" },
      { title: "Testing Guide", teamName: "API", resourceType: "article" },
    ];
    for (const d of data) {
      await repo.saveNew(TeamResource.create({
        ...d,
        description: "Test description",
        resourceLink: "http://test.com",
        thumbnailStorageReference: "ref",
        thumbnailPublicUrl: "url",
      }));
    }
  };

  it("should list resources with pagination", async () => {
    await setupData();
    const result = await useCase.execute(1, 2);
    expect(result.list).toHaveLength(2);
    expect(result.count).toBe(4);
  });

  it("should filter by teamName", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { teamName: "Web" });
    expect(result.list).toHaveLength(2);
    expect(result.list.every(r => r.props.teamName === "Web")).toBe(true);
  });

  it("should filter by resourceType", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { resourceType: "video" });
    expect(result.list).toHaveLength(2);
    expect(result.list.every(r => r.props.resourceType === "video")).toBe(true);
  });

  it("should search in title or description", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { search: "React" });
    expect(result.list).toHaveLength(1);
    expect(result.list[0].props.title).toBe("React Guide");
  });

  it("should return empty list if no matches", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { search: "NonExistent" });
    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(0);
  });
});
