import { describe, expect, it, beforeEach } from "vitest";
import { UpdateTeamResource } from "../UpdateTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { MockTeamResourceStorage } from "../../infrastructure/MockTeamResourceStorage";
import { ITeamResourceTeamService } from "../../domain/ITeamResourceTeamService";

class MockTeamResourceTeamService implements ITeamResourceTeamService {
  public existingTeams: Set<string> = new Set();
  async existsByName(name: string): Promise<boolean> {
    return this.existingTeams.has(name);
  }
}

describe("UpdateTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let teamService: MockTeamResourceTeamService;
  let storage: MockTeamResourceStorage;
  let useCase: UpdateTeamResource;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    teamService = new MockTeamResourceTeamService();
    storage = new MockTeamResourceStorage();
    useCase = new UpdateTeamResource(repo, storage, teamService);
  });

  const setupResource = async () => {
    const uploaded = await storage.uploadFile({
      buffer: new ArrayBuffer(8),
      name: "old.png",
      type: "image/png"
    });

    const resource = TeamResource.create({
      title: "Initial Title",
      description: "Initial Description",
      resourceLink: "http://initial.com",
      resourceType: "video",
      thumbnailStorageReference: uploaded.storageReference,
      thumbnailPublicUrl: uploaded.publicUrl,
      teamName: "Initial Team",
    });
    await repo.saveNew(resource);
    
    // Setup team for initial team
    teamService.existingTeams.add("Initial Team");
    
    return resource;
  };

  it("should update text properties and not affect image", async () => {
    const resource = await setupResource();
    const oldUrl = resource.props.thumbnailPublicUrl;
    const updated = await useCase.execute(resource.props.id, { title: "New Title" });
    
    expect(updated.props.title).toBe("New Title");
    expect(updated.props.thumbnailPublicUrl).toBe(oldUrl);
    expect(storage.exists(oldUrl)).toBe(true);
  });

  it("should replace image if new one provided", async () => {
    const resource = await setupResource();
    const oldUrl = resource.props.thumbnailPublicUrl;
    const newImage = {
      buffer: new ArrayBuffer(8),
      name: "new.png",
      type: "image/png"
    };

    const updated = await useCase.execute(resource.props.id, { thumbnailImage: newImage });
    
    expect(updated.props.thumbnailPublicUrl).not.toBe(oldUrl);
    expect(storage.exists(oldUrl)).toBe(false);
    expect(storage.exists(updated.props.thumbnailPublicUrl)).toBe(true);
  });

  it("should throw error if updated teamName does not exist", async () => {
    const resource = await setupResource();
    await expect(useCase.execute(resource.props.id, { teamName: "Non Existent" })).rejects.toThrow('Team with name "Non Existent" not found.');
  });

  it("should update teamName if team exists", async () => {
    const resource = await setupResource();
    teamService.existingTeams.add("New Team");

    const updated = await useCase.execute(resource.props.id, { teamName: "New Team" });
    expect(updated.props.teamName).toBe("New Team");
  });
});
