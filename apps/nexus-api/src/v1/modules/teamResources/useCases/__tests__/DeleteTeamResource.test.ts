import { describe, expect, it, beforeEach } from "vitest";
import { DeleteTeamResource } from "../DeleteTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { mockFileStorage } from "../../../../utils/MockFileStorage";
import { TeamResourceStorageAdapter } from "../../infrastructure/TeamResourceStorageAdapter";

describe("DeleteTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let storageAdapter: TeamResourceStorageAdapter;
  let useCase: DeleteTeamResource;

  beforeEach(() => {
    mockFileStorage.reset();
    repo = new MockTeamResourceRepository();
    storageAdapter = new TeamResourceStorageAdapter();
    useCase = new DeleteTeamResource(repo, storageAdapter);
  });

  it("should successfully delete an existing team resource and its image", async () => {
    const uploaded = await storageAdapter.uploadFile({
      buffer: new ArrayBuffer(8),
      name: "test.png",
      type: "image/png"
    });

    const resource = TeamResource.create({
      title: "Test",
      description: "Test",
      resourceLink: "http://test.com",
      resourceType: "video",
      thumbnailStorageReference: uploaded.storageReference,
      thumbnailPublicUrl: uploaded.publicUrl,
      teamName: "Test",
    });
    await repo.saveNew(resource);
    
    expect(repo.resources).toHaveLength(1);
    expect(mockFileStorage.exists(uploaded.storageReference)).toBe(true);

    await useCase.execute(resource.props.id);
    
    expect(repo.resources).toHaveLength(0);
    expect(mockFileStorage.exists(uploaded.storageReference)).toBe(false);
  });
});
