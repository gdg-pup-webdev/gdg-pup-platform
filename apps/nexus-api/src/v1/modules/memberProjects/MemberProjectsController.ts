import { MemberProject } from "./domain/MemberProject";
import { CreateMemberProject, CreateMemberProjectInput } from "./useCases/CreateMemberProject";
import { UpdateMemberProject, UpdateMemberProjectInput } from "./useCases/UpdateMemberProject";
import { DeleteMemberProject } from "./useCases/DeleteMemberProject";
import { GetMemberProject } from "./useCases/GetMemberProject";
import { ListMemberProjects } from "./useCases/ListMemberProjects";
import { GetMemberProjectsByGdgId } from "./useCases/GetMemberProjectsByGdgId";
import { SearchMemberProjects } from "./useCases/SearchMemberProjects";
import { GetRandomMemberProjects } from "./useCases/GetRandomMemberProjects";
import { AddMemberProjectImage } from "./useCases/AddMemberProjectImage";
import { DeleteMemberProjectImage } from "./useCases/DeleteMemberProjectImage";
import { ReorderMemberProjectImages } from "./useCases/ReorderMemberProjectImages";
import { ReorderMemberProjects } from "./useCases/ReorderMemberProjects";
import { FileToUpload } from "./domain/IFileStorage";

export type MemberProjectDTO = {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
  images: string[];
  mainImageUrl: string | null;
  secondaryImageUrl: string | null;
  tertiaryImageUrl: string | null;
  memberGdgId: string;
  createdAt: string;
  updatedAt: string;
  member: {
    gdgId: string;
    name: string | null;
    imageUrl: string | null;
    email: string | null;
  } | null;

};

export class MemberProjectsController {
  constructor(
    private createUseCase: CreateMemberProject,
    private updateUseCase: UpdateMemberProject,
    private deleteUseCase: DeleteMemberProject,
    private getOneUseCase: GetMemberProject,
    private listUseCase: ListMemberProjects,
    private getByMemberUseCase: GetMemberProjectsByGdgId,
    private searchUseCase: SearchMemberProjects,
    private randomUseCase: GetRandomMemberProjects,
    private addImageUseCase: AddMemberProjectImage,
    private deleteImageUseCase: DeleteMemberProjectImage,
    private reorderImagesUseCase: ReorderMemberProjectImages,
    private reorderProjectsUseCase: ReorderMemberProjects,
  ) {}

  private toDTO(project: MemberProject): MemberProjectDTO {
    const props = project.props;
    return {
      id: props.id,
      title: props.title,
      startDate: props.startDate.toISOString(),
      endDate: props.endDate ? props.endDate.toISOString() : null,
      description: props.description,
      images: [...props.images],
      mainImageUrl: props.images[0] || null,
      secondaryImageUrl: props.images[1] || null,
      tertiaryImageUrl: props.images[2] || null,
      memberGdgId: props.memberGdgId,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),

      member: props.member ? {
        gdgId: props.member.gdgId,
        name: props.member.name,
        imageUrl: props.member.thumbnailImageUrl,
        email: props.member.email,
      } : null,
    };
  }

  async create(input: {
    title: string;
    startDate: string;
    endDate: string | null;
    description: string;
    memberGdgId: string;
    mainImage?: { buffer: ArrayBuffer; name: string; type: string };
    secondaryImage?: { buffer: ArrayBuffer; name: string; type: string };
    tertiaryImage?: { buffer: ArrayBuffer; name: string; type: string };
  }): Promise<MemberProjectDTO> {
    const createInput: CreateMemberProjectInput = {
      title: input.title,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      description: input.description,
      memberGdgId: input.memberGdgId,
      mainImage: input.mainImage ? new FileToUpload(input.mainImage) : null,
      secondaryImage: input.secondaryImage ? new FileToUpload(input.secondaryImage) : null,
      tertiaryImage: input.tertiaryImage ? new FileToUpload(input.tertiaryImage) : null,
    };

    const project = await this.createUseCase.execute(createInput);
    return this.toDTO(project);
  }

  async update(input: {
    id: string;
    title?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
    mainImage?: { buffer: ArrayBuffer; name: string; type: string };
    secondaryImage?: { buffer: ArrayBuffer; name: string; type: string };
    tertiaryImage?: { buffer: ArrayBuffer; name: string; type: string };
  }): Promise<MemberProjectDTO> {
    const updateInput: UpdateMemberProjectInput = {
      id: input.id,
      title: input.title,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate !== undefined ? (input.endDate ? new Date(input.endDate) : null) : undefined,
      description: input.description,
      mainImage: input.mainImage ? new FileToUpload(input.mainImage) : undefined,
      secondaryImage: input.secondaryImage ? new FileToUpload(input.secondaryImage) : undefined,
      tertiaryImage: input.tertiaryImage ? new FileToUpload(input.tertiaryImage) : undefined,
    };

    const project = await this.updateUseCase.execute(updateInput);
    return this.toDTO(project);
  }

  async delete(id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }

  async getOne(id: string): Promise<MemberProjectDTO> {
    const project = await this.getOneUseCase.execute(id);
    return this.toDTO(project);
  }

  async list(page: number = 1, limit: number = 10): Promise<{ list: MemberProjectDTO[]; count: number }> {
    const result = await this.listUseCase.execute(page, limit);
    return {
      list: result.list.map((p) => this.toDTO(p)),
      count: result.count,
    };
  }

  async getByMember(memberGdgId: string, page: number = 1, limit: number = 10): Promise<{ list: MemberProjectDTO[]; count: number }> {
    const result = await this.getByMemberUseCase.execute(memberGdgId, page, limit);
    return {
      list: result.list.map((p) => this.toDTO(p)),
      count: result.count,
    };
  }

  async search(query: string, page: number = 1, limit: number = 10): Promise<{ list: MemberProjectDTO[]; count: number }> {
    const result = await this.searchUseCase.execute(query, page, limit);
    return {
      list: result.list.map((p) => this.toDTO(p)),
      count: result.count,
    };
  }

  async getRandom(page: number = 1, limit: number = 10): Promise<{ list: MemberProjectDTO[]; count: number }> {
    const result = await this.randomUseCase.execute(page, limit);
    return {
      list: result.list.map((p) => this.toDTO(p)),
      count: result.count,
    };
  }

  async addImage(input: {
    id: string;
    image: { buffer: ArrayBuffer; name: string; type: string };
  }): Promise<MemberProjectDTO> {
    const project = await this.addImageUseCase.execute({
      projectId: input.id,
      image: new FileToUpload(input.image),
    });

    return this.toDTO(project);
  }

  async deleteImage(input: {
    id: string;
    imageIndex: number;
  }): Promise<MemberProjectDTO> {
    const project = await this.deleteImageUseCase.execute({
      projectId: input.id,
      imageIndex: input.imageIndex,
    });

    return this.toDTO(project);
  }

  async reorderImages(input: {
    id: string;
    fromIndex: number;
    toIndex: number;
  }): Promise<MemberProjectDTO> {
    const project = await this.reorderImagesUseCase.execute({
      projectId: input.id,
      fromIndex: input.fromIndex,
      toIndex: input.toIndex,
    });

    return this.toDTO(project);
  }

  async reorderProjects(input: {
    memberGdgId: string;
    fromIndex: number;
    toIndex: number;
  }): Promise<void> {
    await this.reorderProjectsUseCase.execute({
      memberGdgId: input.memberGdgId,
      fromIndex: input.fromIndex,
      toIndex: input.toIndex,
    });
  }
}
