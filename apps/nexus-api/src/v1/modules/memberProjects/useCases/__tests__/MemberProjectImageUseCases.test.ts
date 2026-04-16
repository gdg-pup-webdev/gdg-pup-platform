import { describe, expect, it, beforeEach } from "vitest";
import { MemberProject } from "../../domain/MemberProject";
import { IMemberProjectRepository } from "../../domain/IMemberProjectRepository";
import {
  IFileStorage,
  FileToUpload,
  UploadedFile,
} from "../../domain/IFileStorage";
import { IMemberService } from "../../domain/IMemberService";
import { AddMemberProjectImage } from "../AddMemberProjectImage";
import { DeleteMemberProjectImage } from "../DeleteMemberProjectImage";
import { ReorderMemberProjectImages } from "../ReorderMemberProjectImages";
import { CreateMemberProject } from "../CreateMemberProject";
import { UpdateMemberProject } from "../UpdateMemberProject";
import { DeleteMemberProject } from "../DeleteMemberProject";
import { ValidationError } from "@/v1/errors/HttpError";

class MockMemberProjectRepository extends IMemberProjectRepository {
  private items = new Map<string, MemberProject>();

  private clone(project: MemberProject): MemberProject {
    return MemberProject.hydrate(project.props);
  }

  async saveNew(memberProject: MemberProject): Promise<MemberProject> {
    const cloned = this.clone(memberProject);
    this.items.set(cloned.props.id, cloned);
    return this.clone(cloned);
  }

  async persistUpdates(memberProject: MemberProject): Promise<MemberProject> {
    const cloned = this.clone(memberProject);
    this.items.set(cloned.props.id, cloned);
    return this.clone(cloned);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async reorderByMember(): Promise<void> {
    return;
  }

  async findById(id: string): Promise<MemberProject | null> {
    const item = this.items.get(id);
    return item ? this.clone(item) : null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const all = Array.from(this.items.values()).map((item) => this.clone(item));
    const from = (page - 1) * limit;
    const to = from + limit;

    return {
      list: all.slice(from, to),
      count: all.length,
    };
  }

  async findByMemberGdgId(
    memberGdgId: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const filtered = Array.from(this.items.values())
      .filter((item) => item.props.memberGdgId === memberGdgId)
      .map((item) => this.clone(item));

    const from = (page - 1) * limit;
    const to = from + limit;

    return {
      list: filtered.slice(from, to),
      count: filtered.length,
    };
  }

  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const normalized = query.toLowerCase();
    const filtered = Array.from(this.items.values())
      .filter((item) => {
        const props = item.props;
        return (
          props.title.toLowerCase().includes(normalized) ||
          props.description.toLowerCase().includes(normalized)
        );
      })
      .map((item) => this.clone(item));

    const from = (page - 1) * limit;
    const to = from + limit;

    return {
      list: filtered.slice(from, to),
      count: filtered.length,
    };
  }

  async findRandom(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    return this.findAll(page, limit);
  }
}

class MockFileStorage extends IFileStorage {
  public uploadedPublicUrls: string[] = [];
  public deletedPublicUrls: string[] = [];
  public failDeletes = false;

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const publicUrl = `https://cdn.example.com/${Date.now()}-${file.name}`;
    this.uploadedPublicUrls.push(publicUrl);

    return new UploadedFile({
      storageReference: `member-projects/${file.name}`,
      publicUrl,
    });
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    this.deletedPublicUrls.push(publicUrl);
    return !this.failDeletes;
  }
}

class MockMemberService extends IMemberService {
  constructor(private readonly exists: boolean) {
    super();
  }

  async memberExistsByGdgId(): Promise<boolean> {
    return this.exists;
  }
}

const makeFile = (name: string) =>
  new FileToUpload({
    buffer: new ArrayBuffer(8),
    name,
    type: "image/png",
  });

const makeProject = (images: string[] = []): MemberProject =>
  MemberProject.create({
    title: "Capstone",
    description: "Member project",
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: null,
    projectLink: null,
    images,
    memberGdgId: "GDG-0001",
  });

describe("MemberProjects image usecases", () => {
  let repository: MockMemberProjectRepository;
  let fileStorage: MockFileStorage;

  beforeEach(() => {
    repository = new MockMemberProjectRepository();
    fileStorage = new MockFileStorage();
  });

  it("adds an image to a project", async () => {
    const existing = await repository.saveNew(
      makeProject(["https://cdn.example.com/a.png"]),
    );
    const usecase = new AddMemberProjectImage(repository, fileStorage);

    const updated = await usecase.execute({
      projectId: existing.props.id,
      image: makeFile("new.png"),
    });

    expect(updated.props.images).toHaveLength(2);
    expect(fileStorage.uploadedPublicUrls).toHaveLength(1);
  });

  it("rejects add image when project already has 4 images", async () => {
    const existing = await repository.saveNew(
      makeProject([
        "https://cdn.example.com/1.png",
        "https://cdn.example.com/2.png",
        "https://cdn.example.com/3.png",
        "https://cdn.example.com/4.png",
      ]),
    );

    const usecase = new AddMemberProjectImage(repository, fileStorage);

    await expect(
      usecase.execute({
        projectId: existing.props.id,
        image: makeFile("overflow.png"),
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("deletes a specific image by index", async () => {
    const existing = await repository.saveNew(
      makeProject([
        "https://cdn.example.com/1.png",
        "https://cdn.example.com/2.png",
        "https://cdn.example.com/3.png",
      ]),
    );

    const usecase = new DeleteMemberProjectImage(repository, fileStorage);
    const updated = await usecase.execute({
      projectId: existing.props.id,
      imageIndex: 1,
    });

    expect(updated.props.images).toEqual([
      "https://cdn.example.com/1.png",
      "https://cdn.example.com/3.png",
    ]);
    expect(fileStorage.deletedPublicUrls).toContain(
      "https://cdn.example.com/2.png",
    );
  });

  it("reorders images using fromIndex and toIndex", async () => {
    const existing = await repository.saveNew(
      makeProject([
        "https://cdn.example.com/1.png",
        "https://cdn.example.com/2.png",
        "https://cdn.example.com/3.png",
      ]),
    );

    const usecase = new ReorderMemberProjectImages(repository);
    const updated = await usecase.execute({
      projectId: existing.props.id,
      fromIndex: 2,
      toIndex: 0,
    });

    expect(updated.props.images).toEqual([
      "https://cdn.example.com/3.png",
      "https://cdn.example.com/1.png",
      "https://cdn.example.com/2.png",
    ]);
  });

  it("replaces images list on update", async () => {
    const existing = await repository.saveNew(
      makeProject([
        "https://cdn.example.com/main.png",
        "https://cdn.example.com/second.png",
      ]),
    );

    const usecase = new UpdateMemberProject(repository);
    const updated = await usecase.execute({
      id: existing.props.id,
      images: ["https://cdn.example.com/replacement-main.png"],
    });

    expect(updated.props.images).toEqual([
      "https://cdn.example.com/replacement-main.png",
    ]);
  });

  it("preserves existing dates during partial update", async () => {
    const existing = await repository.saveNew(
      makeProject(["https://cdn.example.com/main.png"]),
    );

    const originalStartDate = existing.props.startDate.toISOString();
    const originalEndDate = existing.props.endDate;

    const usecase = new UpdateMemberProject(repository);
    const updated = await usecase.execute({
      id: existing.props.id,
      title: "Renamed Project",
      description: "Updated description only",
    });

    expect(updated.props.startDate.toISOString()).toBe(originalStartDate);
    expect(updated.props.endDate).toBe(originalEndDate);
  });

  it("deletes all stored images when deleting project", async () => {
    const existing = await repository.saveNew(
      makeProject([
        "https://cdn.example.com/one.png",
        "https://cdn.example.com/two.png",
      ]),
    );

    const usecase = new DeleteMemberProject(repository, fileStorage);
    await usecase.execute(existing.props.id);

    expect(fileStorage.deletedPublicUrls).toEqual([
      "https://cdn.example.com/one.png",
      "https://cdn.example.com/two.png",
    ]);

    const found = await repository.findById(existing.props.id);
    expect(found).toBeNull();
  });

  it("rejects create when more than 4 files are provided", async () => {
    const memberService = new MockMemberService(true);
    const usecase = new CreateMemberProject(repository, memberService);

    await expect(
      usecase.execute({
        title: "Project",
        description: "Test",
        startDate: new Date("2026-01-01T00:00:00.000Z"),
        endDate: null,
        memberGdgId: "GDG-0001",
        images: [
          "https://cdn.example.com/a.png",
          "https://cdn.example.com/b.png",
          "https://cdn.example.com/c.png",
          "https://cdn.example.com/d.png",
          "https://cdn.example.com/e.png",
        ],
      }),
    ).rejects.toThrow(ValidationError);
  });
});
