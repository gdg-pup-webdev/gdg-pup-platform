import { describe, expect, it, beforeEach } from "vitest";
import { UpdateTeamResource } from "../UpdateTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { mockFileStorage } from "../../../../utils/MockFileStorage";
import { TeamResourceStorageAdapter } from "../../infrastructure/TeamResourceStorageAdapter";
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
  let storageAdapter: TeamResourceStorageAdapter;
  let useCase: UpdateTeamResource;

  beforeEach(() => {
    mockFileStorage.reset();
    repo = new MockTeamResourceRepository();
    teamService = new MockTeamResourceTeamService();
    storageAdapter = new TeamResourceStorageAdapter();
    useCase = new UpdateTeamResource(repo, storageAdapter, teamService);
  });

  const setupResource = async () => {
    const uploaded = await storageAdapter.uploadFile({
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
    const oldRef = resource.props.thumbnailStorageReference;
    const updated = await useCase.execute(resource.props.id, { title: "New Title" });
    
    expect(updated.props.title).toBe("New Title");
    expect(updated.props.thumbnailStorageReference).toBe(oldRef);
    expect(mockFileStorage.exists(oldRef)).toBe(true);
  });

  it("should replace image if new one provided", async () => {
    const resource = await setupResource();
    const oldRef = resource.props.thumbnailStorageReference;
    const newImage = {
      buffer: new ArrayBuffer(8),
      name: "new.png",
      type: "image/png"
    };

    const updated = await useCase.execute(resource.props.id, { thumbnailImage: newImage });
    
    expect(updated.props.thumbnailStorageReference).not.toBe(oldRef);
    expect(mockFileStorage.exists(oldRef)).toBe(false);
    expect(mockFileStorage.exists(updated.props.thumbnailStorageReference)).toBe(true);
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
