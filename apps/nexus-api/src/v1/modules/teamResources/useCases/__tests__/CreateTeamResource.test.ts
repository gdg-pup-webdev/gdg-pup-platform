import { describe, expect, it, beforeEach } from "vitest";
import { CreateTeamResource } from "../CreateTeamResource";
import { MockTeamResourceRepository } from "../../infrastructure/MockTeamResourceRepository";
import { mockFileStorage } from "../../../../utils/MockFileStorage";
import { TeamResourceStorageAdapter } from "../../infrastructure/TeamResourceStorageAdapter";

describe("CreateTeamResource Use Case", () => {
  let repo: MockTeamResourceRepository;
  let storageAdapter: TeamResourceStorageAdapter;
  let useCase: CreateTeamResource;

  beforeEach(() => {
    mockFileStorage.reset();
    repo = new MockTeamResourceRepository();
    storageAdapter = new TeamResourceStorageAdapter();
    useCase = new CreateTeamResource(repo, storageAdapter);
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

  it("should successfully upload image and create a team resource", async () => {
    const resource = await useCase.execute(validProps);
    
    expect(resource.props.id).toBeDefined();
    expect(resource.props.thumbnailStorageReference).toContain("/uploads/");
    expect(repo.resources).toHaveLength(1);
    expect(mockFileStorage.exists(resource.props.thumbnailStorageReference)).toBe(true);
  });
});
