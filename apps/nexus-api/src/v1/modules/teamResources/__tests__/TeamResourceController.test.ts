import { describe, expect, it, beforeEach } from "vitest";
import { TeamResourceController } from "../TeamResourceController";
import { CreateTeamResource } from "../useCases/CreateTeamResource";
import { GetTeamResource } from "../useCases/GetTeamResource";
import { ListTeamResources } from "../useCases/ListTeamResources";
import { UpdateTeamResource } from "../useCases/UpdateTeamResource";
import { DeleteTeamResource } from "../useCases/DeleteTeamResource";
import { MockTeamResourceRepository } from "../infrastructure/MockTeamResourceRepository";
import { MockTeamResourceStorage } from "../infrastructure/MockTeamResourceStorage";
import { ITeamResourceTeamService } from "../domain/ITeamResourceTeamService";

class MockTeamResourceTeamService implements ITeamResourceTeamService {
  public existingTeams: Set<string> = new Set();
  async existsByName(name: string): Promise<boolean> {
    return this.existingTeams.has(name);
  }
}

describe("TeamResourceController", () => {
  let controller: TeamResourceController;
  let repo: MockTeamResourceRepository;
  let teamService: MockTeamResourceTeamService;
  let storage: MockTeamResourceStorage;

  beforeEach(() => {
    repo = new MockTeamResourceRepository();
    teamService = new MockTeamResourceTeamService();
    storage = new MockTeamResourceStorage();
    controller = new TeamResourceController(
      new CreateTeamResource(repo, storage, teamService),
      new GetTeamResource(repo),
      new ListTeamResources(repo),
      new UpdateTeamResource(repo, storage, teamService),
      new DeleteTeamResource(repo, storage)
    );
  });

  const sampleData = {
    title: "Intro to Clean Architecture",
    description: "Learn how to structure your code for maintainability.",
    resourceLink: "https://example.com/clean-arch",
    resourceType: "video",
    teamName: "Web Development",
    thumbnailImage: {
      buffer: new ArrayBuffer(8),
      name: "thumb.png",
      type: "image/png"
    }
  };

  it("should create a team resource and return DTO", async () => {
    // Setup team
    teamService.existingTeams.add("Web Development");

    const result = await controller.create(sampleData);
    expect(result.id).toBeDefined();
    expect(result.thumbnailPublicUrl).toContain("https://mock-url.com/");
  });

  it("should delete resource and its image", async () => {
    // Setup team
    teamService.existingTeams.add("Web Development");

    const created = await controller.create(sampleData);
    const resource = await repo.findById(created.id);
    const publicUrl = resource!.props.thumbnailPublicUrl;
    
    await controller.deleteResource(created.id);
    
    expect(storage.exists(publicUrl)).toBe(false);
  });
});
