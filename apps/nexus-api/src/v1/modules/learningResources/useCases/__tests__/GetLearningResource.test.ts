import { describe, expect, it, beforeEach } from "vitest";
import { GetLearningResource } from "../GetLearningResource";
import { LearningResource } from "../../domain/LearningResource";
import { MockLearningResourceRepository } from "../../infrastructure/MockLearningResourceRepository";

describe("GetLearningResource Use Case", () => {
  let repo: MockLearningResourceRepository;
  let useCase: GetLearningResource;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    useCase = new GetLearningResource(repo);
  });

  it("should successfully return an existing learning resource", async () => {
    const resource = LearningResource.create({
      title: "Test",
      description: "Test",
      url: "http://test.com",
      tags: ["video"],
      teamId: "test-team",
      eventId: null,
      thumbnailUrl: "url",
    });
    await repo.saveNew(resource);

    const found = await useCase.execute(resource.props.id);
    expect(found).not.toBeNull();
    expect(found!.props.id).toBe(resource.props.id);
    expect(found!.props.title).toBe("Test");
  });

  it("should return null if learning resource does not exist", async () => {
    const found = await useCase.execute("non-existent-id");
    expect(found).toBeNull();
  });
});
