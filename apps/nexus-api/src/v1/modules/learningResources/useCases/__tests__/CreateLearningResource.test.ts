import { describe, expect, it, beforeEach } from "vitest";
import { CreateLearningResource } from "../CreateLearningResource";
import { MockLearningResourceRepository } from "../../infrastructure/MockLearningResourceRepository";
import { MockLearningResourceStorage } from "../../infrastructure/MockLearningResourceStorage";
import { ITeamModule } from "../../domain/ITeamModule";
import { IEventModule } from "../../domain/IEventModule";

class MockTeamModule implements ITeamModule {
  public existingTeams: Set<string> = new Set();
  async existsById(id: string): Promise<boolean> {
    return this.existingTeams.has(id);
  }
}

class MockEventModule implements IEventModule {
  public existingEvents: Set<string> = new Set();
  async existsById(id: string): Promise<boolean> {
    return this.existingEvents.has(id);
  }
}

describe("CreateLearningResource Use Case", () => {
  let repo: MockLearningResourceRepository;
  let teamModule: MockTeamModule;
  let eventModule: MockEventModule;
  let storage: MockLearningResourceStorage;
  let useCase: CreateLearningResource;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    teamModule = new MockTeamModule();
    eventModule = new MockEventModule();
    storage = new MockLearningResourceStorage();
    useCase = new CreateLearningResource(repo, storage, teamModule, eventModule);
  });

  const validProps = {
    title: "Intro to Clean Architecture",
    description: "Learn how to structure your code for maintainability.",
    url: "https://example.com/clean-arch",
    tags: ["clean-architecture"],
    teamId: "web-dev-id",
    eventId: null,
    thumbnailImage: {
      buffer: new ArrayBuffer(8),
      name: "thumb.png",
      type: "image/png"
    }
  };

  it("should successfully upload image and create a learning resource if team exists", async () => {
    // Setup team
    teamModule.existingTeams.add("web-dev-id");

    const resource = await useCase.execute(validProps);
    
    expect(resource.props.id).toBeDefined();
    expect(resource.props.teamId).toBe("web-dev-id");
    expect(repo.resources).toHaveLength(1);
    expect(storage.exists(resource.props.thumbnailUrl!)).toBe(true);
  });

  it("should throw an error if team does not exist", async () => {
    await expect(useCase.execute(validProps)).rejects.toThrow('Team with ID "web-dev-id" not found.');
  });

  it("should NOT throw an error if thumbnail image is missing (it is optional)", async () => {
    // Setup team
    teamModule.existingTeams.add("web-dev-id");

    const props = { ...validProps, thumbnailImage: undefined };
    const resource = await useCase.execute(props);
    expect(resource.props.id).toBeDefined();
    expect(resource.props.thumbnailUrl).toBeNull();
  });
});
