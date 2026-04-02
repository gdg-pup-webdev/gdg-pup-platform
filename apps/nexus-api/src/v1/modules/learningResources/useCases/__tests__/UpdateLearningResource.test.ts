import { describe, expect, it, beforeEach } from "vitest";
import { UpdateLearningResource } from "../UpdateLearningResource";
import { LearningResource } from "../../domain/LearningResource";
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

describe("UpdateLearningResource Use Case", () => {
  let repo: MockLearningResourceRepository;
  let teamModule: MockTeamModule;
  let eventModule: MockEventModule;
  let storage: MockLearningResourceStorage;
  let useCase: UpdateLearningResource;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    teamModule = new MockTeamModule();
    eventModule = new MockEventModule();
    storage = new MockLearningResourceStorage();
    useCase = new UpdateLearningResource(repo, storage, teamModule, eventModule);
  });

  const setupResource = async () => {
    const uploaded = await storage.uploadFile({
      buffer: new ArrayBuffer(8),
      name: "old.png",
      type: "image/png"
    });

    const resource = LearningResource.create({
      title: "Initial Title",
      description: "Initial Description",
      url: "http://initial.com",
      tags: ["video"],
      teamId: "initial-team-id",
      eventId: null,
      thumbnailUrl: uploaded.publicUrl,
    });
    await repo.saveNew(resource);
    
    // Setup team for initial team
    teamModule.existingTeams.add("initial-team-id");
    
    return resource;
  };

  it("should update text properties and not affect image", async () => {
    const resource = await setupResource();
    const oldUrl = resource.props.thumbnailUrl;
    const updated = await useCase.execute(resource.props.id, { title: "New Title" });
    
    expect(updated.props.title).toBe("New Title");
    expect(updated.props.thumbnailUrl).toBe(oldUrl);
    expect(storage.exists(oldUrl!)).toBe(true);
  });

  it("should replace image if new one provided", async () => {
    const resource = await setupResource();
    const oldUrl = resource.props.thumbnailUrl;
    const newImage = {
      buffer: new ArrayBuffer(8),
      name: "new.png",
      type: "image/png"
    };

    const updated = await useCase.execute(resource.props.id, { thumbnailImage: newImage });
    
    expect(updated.props.thumbnailUrl).not.toBe(oldUrl);
    // Note: The implementation of UpdateLearningResource doesn't currently delete the old file
    // but the test can check that the new one exists.
    expect(storage.exists(updated.props.thumbnailUrl!)).toBe(true);
  });

  it("should throw error if updated teamId does not exist", async () => {
    const resource = await setupResource();
    await expect(useCase.execute(resource.props.id, { teamId: "non-existent" })).rejects.toThrow('Team with ID "non-existent" not found.');
  });

  it("should update teamId if team exists", async () => {
    const resource = await setupResource();
    teamModule.existingTeams.add("new-team-id");

    const updated = await useCase.execute(resource.props.id, { teamId: "new-team-id" });
    expect(updated.props.teamId).toBe("new-team-id");
  });
});
