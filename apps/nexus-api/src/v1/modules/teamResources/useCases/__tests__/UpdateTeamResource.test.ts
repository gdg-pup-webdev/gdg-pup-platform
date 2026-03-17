import { describe, expect, it, beforeEach } from "vitest";
import { UpdateTeamResource } from "../UpdateTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { mockFileStorage } from "../../../../utils/MockFileStorage";
import { TeamResourceStorageAdapter } from "../../infrastructure/TeamResourceStorageAdapter";

describe("UpdateTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let storageAdapter: TeamResourceStorageAdapter;
  let useCase: UpdateTeamResource;

  beforeEach(() => {
    mockFileStorage.reset();
    repo = new MockTeamResourceRepository();
    storageAdapter = new TeamResourceStorageAdapter();
    useCase = new UpdateTeamResource(repo, storageAdapter);
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
});
