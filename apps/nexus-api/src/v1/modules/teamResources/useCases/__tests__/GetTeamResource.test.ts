import { describe, expect, it, beforeEach } from "vitest";
import { GetTeamResource } from "../GetTeamResource";
import { TeamResource } from "../../domain/TeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";

describe("GetTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let useCase: GetTeamResource;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    useCase = new GetTeamResource(repo);
  });

  it("should successfully return an existing team resource", async () => {
    const resource = TeamResource.create({
      title: "Test",
      description: "Test",
      resourceLink: "http://test.com",
      resourceType: "video",
      thumbnailImage: "test",
      teamName: "Test",
    });
    await repo.saveNew(resource);

    const found = await useCase.execute(resource.props.id);
    expect(found.props.id).toBe(resource.props.id);
    expect(found.props.title).toBe("Test");
  });

  it("should throw an error if team resource does not exist", async () => {
    await expect(useCase.execute("non-existent-id")).rejects.toThrow("Team resource not found.");
  });
});
