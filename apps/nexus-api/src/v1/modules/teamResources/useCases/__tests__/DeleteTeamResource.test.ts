import { describe, expect, it, beforeEach } from "vitest";
import { DeleteTeamResource } from "../DeleteTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { MockTeamResourceStorage } from "../../infrastructure/MockTeamResourceStorage";

describe("DeleteTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let storage: MockTeamResourceStorage;
  let useCase: DeleteTeamResource;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    storage = new MockTeamResourceStorage();
    useCase = new DeleteTeamResource(repo, storage);
  });

  it("should successfully delete an existing team resource and its image", async () => {
    const uploaded = await storage.uploadFile({
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
    expect(storage.exists(uploaded.publicUrl)).toBe(true);

    await useCase.execute(resource.props.id);
    
    expect(repo.resources).toHaveLength(0);
    expect(storage.exists(uploaded.publicUrl)).toBe(false);
  });
});
