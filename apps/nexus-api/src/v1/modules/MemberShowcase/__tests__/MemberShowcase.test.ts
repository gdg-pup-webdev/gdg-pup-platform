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
import { IMembersService, ShowcasedMember } from "../domain/IMembersService";
import { IFileStorageService, FileToUpload, UploadedFile } from "../domain/IFileStorageService";

describe("MemberShowcase Module", () => {
  let repo: MockMemberShowcaseRepository;
  let membersService: IMembersService;
  let fileStorage: IFileStorageService;
  
  let createUseCase: CreateMemberShowcase;
  let listUseCase: ListMemberShowcases;
  let getOneUseCase: GetMemberShowcase;
  let updateUseCase: UpdateMemberShowcase;
  let deleteUseCase: DeleteMemberShowcase;
  let getSpotlightUseCase: GetSpotlightOfTheDay;
  let controller: MemberShowcaseController;

  beforeEach(() => {
    repo = new MockMemberShowcaseRepository();
    
    const mockShowcasedMember: ShowcasedMember = {
      gdgId: "member-1",
      displayName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      avatarUrl: "http://avatar.com",
      program: "BSCS",
      yearLevel: 4
    };

    membersService = {
      findByIds: vi.fn().mockResolvedValue([mockShowcasedMember]),
      exists: vi.fn().mockResolvedValue(true)
    };

    fileStorage = {
      uploadFile: vi.fn().mockResolvedValue(new UploadedFile({ 
        storageReference: "ref", 
        publicUrl: "http://example.com/uploaded.png" 
      })),
      deleteFile: vi.fn().mockResolvedValue(true)
    } as any;

    createUseCase = new CreateMemberShowcase(repo, fileStorage);
    listUseCase = new ListMemberShowcases(repo);
    getOneUseCase = new GetMemberShowcase(repo, membersService);
    updateUseCase = new UpdateMemberShowcase(repo, fileStorage);
    deleteUseCase = new DeleteMemberShowcase(repo, fileStorage);
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
    it("should create a member showcase and upload thumbnail", async () => {
      const props = {
        title: "Test Showcase",
        description: "Test Description",
        thumbnailFile: new FileToUpload({
          buffer: new ArrayBuffer(0),
          name: "test.png",
          type: "image/png"
        }),
        date: new Date(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      const result = await createUseCase.execute(props);
      expect(result.props.title).toBe(props.title);
      expect(result.props.thumbnailUrl).toBe("http://example.com/uploaded.png");
      expect(fileStorage.uploadFile).toHaveBeenCalled();
    });

    it("should throw error if required fields are missing", async () => {
      const props = {
        title: "",
        description: "Test Description",
        thumbnailFile: null as any,
        date: new Date(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      await expect(createUseCase.execute(props)).rejects.toThrow();
    });
  });

  describe("UpdateMemberShowcase", () => {
    it("should update thumbnail if new file is provided", async () => {
      const showcase = await repo.saveNew(MemberShowcase.create({
        title: "Old",
        description: "Old",
        thumbnailUrl: "old-url",
        date: new Date(),
        articleUrl: "old",
        showcasedMembers: ["m1"]
      }));

      const updates = {
        title: "New",
        thumbnailFile: new FileToUpload({
          buffer: new ArrayBuffer(0),
          name: "new.png",
          type: "image/png"
        })
      };

      const result = await updateUseCase.execute(showcase.props.id, updates);
      expect(result.props.title).toBe("New");
      expect(result.props.thumbnailUrl).toBe("http://example.com/uploaded.png");
      expect(fileStorage.deleteFile).toHaveBeenCalledWith("old-url");
      expect(fileStorage.uploadFile).toHaveBeenCalled();
    });
  });

  describe("DeleteMemberShowcase", () => {
    it("should delete showcase and associated file", async () => {
       const showcase = await repo.saveNew(MemberShowcase.create({
        title: "To Delete",
        description: "Desc",
        thumbnailUrl: "to-delete-url",
        date: new Date(),
        articleUrl: "art",
        showcasedMembers: ["m1"]
      }));

      await deleteUseCase.execute(showcase.props.id);
      expect(await repo.findById(showcase.props.id)).toBeNull();
      expect(fileStorage.deleteFile).toHaveBeenCalledWith("to-delete-url");
    });
  });

  describe("Controller", () => {
    it("should return DTO on create", async () => {
      const input = {
        title: "Test Showcase",
        description: "Test Description",
        thumbnailFile: new FileToUpload({
          buffer: new ArrayBuffer(0),
          name: "test.png",
          type: "image/png"
        }),
        date: new Date(),
        articleUrl: "http://example.com/article",
        showcasedMembers: ["member-1"]
      };

      const result = await controller.create(input);
      expect(result.title).toBe(input.title);
      expect(result.thumbnailUrl).toBe("http://example.com/uploaded.png");
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
      expect(result.showcasedMembers[0].displayName).toBe("John Doe");
    });
  });
});
