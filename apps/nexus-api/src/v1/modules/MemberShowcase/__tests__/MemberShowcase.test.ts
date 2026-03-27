import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockMemberShowcaseRepository } from "../infrastructure/MockMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";
import { CreateMemberShowcase } from "../useCases/CreateMemberShowcase";
import { ListMemberShowcases } from "../useCases/ListMemberShowcases";
import { GetMemberShowcase } from "../useCases/GetMemberShowcase";
import { UpdateMemberShowcase } from "../useCases/UpdateMemberShowcase";
import { DeleteMemberShowcase } from "../useCases/DeleteMemberShowcase";
import { GetSpotlightOfTheDay } from "../useCases/GetSpotlightOfTheDay";
import { MemberShowcaseController } from "../MemberShowcaseController";
import { IMembersService } from "../domain/IMembersService";

describe("MemberShowcase Module", () => {
  let repo: MockMemberShowcaseRepository;
  let membersService: IMembersService;
  
  let createUseCase: CreateMemberShowcase;
  let listUseCase: ListMemberShowcases;
  let getOneUseCase: GetMemberShowcase;
  let updateUseCase: UpdateMemberShowcase;
  let deleteUseCase: DeleteMemberShowcase;
  let getSpotlightUseCase: GetSpotlightOfTheDay;
  let controller: MemberShowcaseController;

  beforeEach(() => {
    repo = new MockMemberShowcaseRepository();
    membersService = {
      findByIds: vi.fn().mockResolvedValue([{ id: "member-1", name: "John Doe" }]),
      exists: vi.fn().mockResolvedValue(true)
    };

    createUseCase = new CreateMemberShowcase(repo);
    listUseCase = new ListMemberShowcases(repo);
    getOneUseCase = new GetMemberShowcase(repo, membersService);
    updateUseCase = new UpdateMemberShowcase(repo);
    deleteUseCase = new DeleteMemberShowcase(repo);
    getSpotlightUseCase = new GetSpotlightOfTheDay(repo, membersService);

    controller = new MemberShowcaseController(
      createUseCase,
      listUseCase,
      getOneUseCase,
      updateUseCase,
      deleteUseCase,
      getSpotlightUseCase
    );
  });

  describe("CreateMemberShowcase", () => {
    it("should create a member showcase", async () => {
      const props = {
        title: "Test Showcase",
        description: "Test Description",
        thumbnailUrl: "http://example.com/thumb.png",
        date: new Date(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      const result = await createUseCase.execute(props);
      expect(result.props.title).toBe(props.title);
      expect(result.props.id).toBeDefined();
    });

    it("should throw error if required fields are missing", async () => {
      const props = {
        title: "",
        description: "Test Description",
        thumbnailUrl: "http://example.com/thumb.png",
        date: new Date(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      await expect(createUseCase.execute(props as any)).rejects.toThrow();
    });
  });

  describe("ListMemberShowcases", () => {
    it("should list member showcases", async () => {
      await repo.saveNew(MemberShowcase.create({
        title: "Showcase 1",
        description: "Desc 1",
        thumbnailUrl: "thumb1",
        date: new Date(),
        articleUrl: "art1",
        showcasedMembers: ["m1"]
      }));

      const { list, count } = await listUseCase.execute(1, 10);
      expect(count).toBe(1);
      expect(list[0].props.title).toBe("Showcase 1");
    });
  });

  describe("Controller", () => {
    it("should return DTO on create", async () => {
      const props = {
        title: "Test Showcase",
        description: "Test Description",
        thumbnailUrl: "http://example.com/thumb.png",
        date: new Date().toISOString(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      const result = await controller.create({
        ...props,
        date: new Date(props.date)
      });
      expect(result.title).toBe(props.title);
      expect(typeof result.date).toBe("string");
    });

    it("should return enriched data on getOne", async () => {
      const showcase = await repo.saveNew(MemberShowcase.create({
        title: "Showcase 1",
        description: "Desc 1",
        thumbnailUrl: "thumb1",
        date: new Date(),
        articleUrl: "art1",
        showcasedMembers: ["m1"]
      }));

      const result = await controller.getOne(showcase.props.id);
      expect(result.title).toBe("Showcase 1");
      expect(result.showcasedMembers).toHaveLength(1);
      expect(result.showcasedMembers[0].name).toBe("John Doe");
    });
  });
});
