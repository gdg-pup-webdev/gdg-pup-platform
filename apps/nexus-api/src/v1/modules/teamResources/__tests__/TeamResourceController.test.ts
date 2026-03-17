import { describe, expect, it, beforeEach } from "vitest";
import { TeamResourceController } from "../TeamResourceController";
import { CreateTeamResource } from "../useCases/CreateTeamResource";
import { GetTeamResource } from "../useCases/GetTeamResource";
import { ListTeamResources } from "../useCases/ListTeamResources";
import { UpdateTeamResource } from "../useCases/UpdateTeamResource";
import { DeleteTeamResource } from "../useCases/DeleteTeamResource";
import { MockTeamResourceRepository } from "../infrastructure/MockTeamResourceRepository";

describe("TeamResourceController", () => {
  let controller: TeamResourceController;
  let repo: MockTeamResourceRepository;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    controller = new TeamResourceController(
      new CreateTeamResource(repo),
      new GetTeamResource(repo),
      new ListTeamResources(repo),
      new UpdateTeamResource(repo),
      new DeleteTeamResource(repo)
    );
  });

  const sampleData = {
    title: "Intro to Clean Architecture",
    description: "Learn how to structure your code for maintainability.",
    resourceLink: "https://example.com/clean-arch",
    resourceType: "video",
    thumbnailImage: "file-id-123",
    teamName: "Web Development",
  };

  it("should create and return a DTO", async () => {
    const result = await controller.create(sampleData);
    expect(result.id).toBeDefined();
    expect(result.title).toBe(sampleData.title);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it("should get a resource by id and return a DTO", async () => {
    const created = await controller.create(sampleData);
    const result = await controller.getResource(created.id);
    expect(result.id).toBe(created.id);
  });

  it("should list resources and return DTOs with count", async () => {
    await controller.create(sampleData);
    const result = await controller.listResources(1, 10, {});
    expect(result.list).toHaveLength(1);
    expect(result.count).toBe(1);
    expect(result.list[0].id).toBeDefined();
  });

  it("should update a resource and return a DTO", async () => {
    const created = await controller.create(sampleData);
    const result = await controller.updateResource(created.id, { title: "Updated Title" });
    expect(result.title).toBe("Updated Title");
  });

  it("should delete a resource and return true", async () => {
    const created = await controller.create(sampleData);
    const result = await controller.deleteResource(created.id);
    expect(result).toBe(true);
    expect(repo.resources).toHaveLength(0);
  });
});
