import { describe, expect, it, beforeEach } from "vitest";
import { CreateTeamResource } from "../CreateTeamResource";
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

describe("CreateTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let teamService: MockTeamResourceTeamService;
  let storageAdapter: TeamResourceStorageAdapter;
  let useCase: CreateTeamResource;

  beforeEach(() => {
    mockFileStorage.reset();
    repo = new MockTeamResourceRepository();
    teamService = new MockTeamResourceTeamService();
    storageAdapter = new TeamResourceStorageAdapter();
    useCase = new CreateTeamResource(repo, storageAdapter, teamService);
  });

  const validProps = {
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

  it("should successfully upload image and create a team resource if team exists", async () => {
    // Setup team
    teamService.existingTeams.add("Web Development");

    const resource = await useCase.execute(validProps);
    
    expect(resource.props.id).toBeDefined();
    expect(resource.props.teamName).toBe("Web Development");
    expect(repo.resources).toHaveLength(1);
    expect(mockFileStorage.exists(resource.props.thumbnailStorageReference)).toBe(true);
  });

  it("should throw an error if team does not exist", async () => {
    await expect(useCase.execute(validProps)).rejects.toThrow('Team with name "Web Development" not found.');
  });

  it("should throw an error if thumbnail image is missing", async () => {
    // Setup team
    teamService.existingTeams.add("Web Development");

    const props = { ...validProps, thumbnailImage: null as any };
    await expect(useCase.execute(props)).rejects.toThrow("Thumbnail image is required.");
  });
});
