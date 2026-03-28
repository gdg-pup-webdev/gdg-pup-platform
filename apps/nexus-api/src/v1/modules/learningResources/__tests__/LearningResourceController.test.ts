import { LearningResourceController } from "../LearningResourceController";
import { CreateLearningResource } from "../useCases/CreateLearningResource";
import { GetLearningResource } from "../useCases/GetLearningResource";
import { ListLearningResources } from "../useCases/ListLearningResources";
import { UpdateLearningResource } from "../useCases/UpdateLearningResource";
import { DeleteLearningResource } from "../useCases/DeleteLearningResource";
import { SearchLearningResources } from "../useCases/SearchLearningResources";
import { ListLearningResourcesByTag } from "../useCases/ListLearningResourcesByTag";
import { MockLearningResourceRepository } from "../infrastructure/MockLearningResourceRepository";
import { MockLearningResourceStorage } from "../infrastructure/MockLearningResourceStorage";
import { ITeamModule } from "../domain/ITeamModule";
import { IEventModule } from "../domain/IEventModule";

class MockTeamModule implements ITeamModule {
  async existsById(id: string): Promise<boolean> { return true; }
}

class MockEventModule implements IEventModule {
  async existsById(id: string): Promise<boolean> { return true; }
}

describe("LearningResourceController", () => {
  let controller: LearningResourceController;
  let repo: MockLearningResourceRepository;
  let storage: MockLearningResourceStorage;
  let teamModule: MockTeamModule;
  let eventModule: MockEventModule;

  beforeEach(() => {
    repo = new MockLearningResourceRepository();
    storage = new MockLearningResourceStorage();
    teamModule = new MockTeamModule();
    eventModule = new MockEventModule();

    controller = new LearningResourceController(
      new CreateLearningResource(repo, storage, teamModule, eventModule),
      new GetLearningResource(repo),
      new ListLearningResources(repo),
      new UpdateLearningResource(repo, storage, teamModule, eventModule),
      new DeleteLearningResource(repo, storage),
      new SearchLearningResources(repo),
      new ListLearningResourcesByTag(repo)
    );
  });

  const sampleData = {
    title: "Test Resource",
    description: "Test Description",
    url: "https://test.com",
    tags: ["test"],
    teamId: "00000000-0000-0000-0000-000000000000",
    eventId: null,
    thumbnailImage: {
      buffer: new ArrayBuffer(8),
      name: "test.png",
      type: "image/png",
    },
  };

  it("should create a learning resource", async () => {
    const result = await controller.create(sampleData);
    expect(result.title).toBe(sampleData.title);
    expect(result.thumbnailUrl).toContain("https://mock-url.com/");
  });

  it("should get a learning resource by id", async () => {
    const created = await controller.create(sampleData);
    const result = await controller.getResource(created.id);
    expect(result?.id).toBe(created.id);
  });
});
