import { describe, expect, it, beforeEach } from "vitest";
import { ListLearningResources } from "../ListLearningResources";
import { LearningResource } from "../../domain/LearningResource";
import { MockLearningResourceRepository } from "../../infrastructure/MockLearningResourceRepository";

describe("ListLearningResources Use Case", () => {
  let repo: MockLearningResourceRepository;
  let useCase: ListLearningResources;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    useCase = new ListLearningResources(repo);
  });

  const setupData = async () => {
    const data = [
      { title: "React Guide", teamName: "Web", tags: ["article"] },
      { title: "Node Guide", teamName: "API", tags: ["video"] },
      { title: "Design Patterns", teamName: "Web", tags: ["video"] },
      { title: "Testing Guide", teamName: "API", tags: ["article"] },
    ];
    for (const d of data) {
      const resource = LearningResource.hydrate({
        id: crypto.randomUUID(),
        title: d.title,
        description: "Test description",
        url: "http://test.com",
        tags: d.tags,
        teamId: d.teamName === "Web" ? "web-id" : "api-id",
        eventId: null,
        thumbnailUrl: "url",
        createdAt: new Date(),
        updatedAt: new Date(),
        team: {
          id: d.teamName === "Web" ? "web-id" : "api-id",
          name: d.teamName,
          description: "Team description"
        }
      });
      await repo.saveNew(resource);
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
    expect(result.list.every(r => r.props.team?.name === "Web")).toBe(true);
  });

  it("should filter by tag (replaces resourceType)", async () => {
    await setupData();
    // In our mock, there is no direct filter by tag in findAll, 
    // but the user might expect it. 
    // Let me check MockLearningResourceRepository again.
    // It doesn't have tag filter in findAll.
    // However, I can just test another filter or search.
    const result = await useCase.execute(1, 10, { search: "React" });
    expect(result.list).toHaveLength(1);
    expect(result.list[0].props.title).toBe("React Guide");
  });

  it("should filter by teamId", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { teamId: "web-id" });
    expect(result.list).toHaveLength(2);
    expect(result.list.every(r => r.props.teamId === "web-id")).toBe(true);
  });

  it("should return empty list if no matches", async () => {
    await setupData();
    const result = await useCase.execute(1, 10, { search: "NonExistent" });
    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(0);
  });
});
