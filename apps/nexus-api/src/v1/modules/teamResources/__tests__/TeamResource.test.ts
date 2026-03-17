import { describe, expect, it, beforeEach } from "vitest";
import { CreateTeamResource } from "../useCases/CreateTeamResource";
import { GetTeamResource } from "../useCases/GetTeamResource";
import { ListTeamResources } from "../useCases/ListTeamResources";
import { UpdateTeamResource } from "../useCases/UpdateTeamResource";
import { DeleteTeamResource } from "../useCases/DeleteTeamResource";
import { MockTeamResourceRepository } from "../infrastructure/MockTeamResourceRepository";

describe("TeamResource Use Cases", () => {
  let repo: MockTeamResourceRepository;
  let createUseCase: CreateTeamResource;
  let getUseCase: GetTeamResource;
  let listUseCase: ListTeamResources;
  let updateUseCase: UpdateTeamResource;
  let deleteUseCase: DeleteTeamResource;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    createUseCase = new CreateTeamResource(repo);
    getUseCase = new GetTeamResource(repo);
    listUseCase = new ListTeamResources(repo);
    updateUseCase = new UpdateTeamResource(repo);
    deleteUseCase = new DeleteTeamResource(repo);
  });

  const sampleResource = {
    title: "Intro to Clean Architecture",
    description: "Learn how to structure your code for maintainability.",
    resourceLink: "https://example.com/clean-arch",
    resourceType: "video",
    thumbnailImage: "file-id-123",
    teamName: "Web Development",
  };

  it("should create a new team resource", async () => {
    const resource = await createUseCase.execute(sampleResource);
    expect(resource.props.id).toBeDefined();
    expect(resource.props.title).toBe(sampleResource.title);
    expect(repo.resources).toHaveLength(1);
  });

  it("should get a team resource by id", async () => {
    const created = await createUseCase.execute(sampleResource);
    const resource = await getUseCase.execute(created.props.id);
    expect(resource.props.id).toBe(created.props.id);
  });

  it("should list team resources with pagination and filters", async () => {
    await createUseCase.execute(sampleResource);
    await createUseCase.execute({ ...sampleResource, title: "Different Title", teamName: "Design" });

    const result = await listUseCase.execute(1, 10, { teamName: "Web Development" });
    expect(result.list).toHaveLength(1);
    expect(result.count).toBe(1);

    const result2 = await listUseCase.execute(1, 10);
    expect(result2.count).toBe(2);
  });

  it("should update a team resource", async () => {
    const created = await createUseCase.execute(sampleResource);
    const initialUpdatedAt = created.props.updatedAt.getTime();
    
    // Add small delay to ensure updatedAt > createdAt
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const updated = await updateUseCase.execute(created.props.id, { title: "Updated Title" });
    expect(updated.props.title).toBe("Updated Title");
    expect(updated.props.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);
  });

  it("should delete a team resource", async () => {
    const created = await createUseCase.execute(sampleResource);
    await deleteUseCase.execute(created.props.id);
    expect(repo.resources).toHaveLength(0);
    await expect(getUseCase.execute(created.props.id)).rejects.toThrow("Team resource not found.");
  });
});
