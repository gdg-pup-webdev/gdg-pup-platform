import { describe, expect, it, beforeEach } from "vitest";
import { DeleteLearningResource } from "../DeleteLearningResource";
import { LearningResource } from "../../domain/LearningResource";
import { MockLearningResourceRepository } from "../../infrastructure/MockLearningResourceRepository";
import { MockLearningResourceStorage } from "../../infrastructure/MockLearningResourceStorage";

describe("DeleteLearningResource Use Case", () => {
  let repo: MockLearningResourceRepository;
  let storage: MockLearningResourceStorage;
  let useCase: DeleteLearningResource;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    storage = new MockLearningResourceStorage();
    useCase = new DeleteLearningResource(repo, storage);
  });

  it("should successfully delete an existing learning resource and its image", async () => {
    const uploaded = await storage.uploadFile({
      buffer: new ArrayBuffer(8),
      name: "test.png",
      type: "image/png"
    });

    const resource = LearningResource.create({
      title: "Test",
      description: "Test",
      url: "http://test.com",
      tags: ["video"],
      teamId: "test-team",
      eventId: null,
      thumbnailUrl: uploaded.publicUrl,
    });
    await repo.saveNew(resource);
    
    expect(repo.resources).toHaveLength(1);
    expect(storage.exists(uploaded.publicUrl)).toBe(true);

    await useCase.execute(resource.props.id);
    
    expect(repo.resources).toHaveLength(0);
    expect(storage.exists(uploaded.publicUrl)).toBe(false);
  });
});
