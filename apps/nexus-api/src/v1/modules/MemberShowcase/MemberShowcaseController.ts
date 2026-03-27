import { MemberShowcase, MemberShowcaseInsertProps, MemberShowcaseUpdateProps } from "./domain/MemberShowcase";
import { CreateMemberShowcase, CreateMemberShowcaseInput } from "./useCases/CreateMemberShowcase";
import { ListMemberShowcases } from "./useCases/ListMemberShowcases";
import { GetMemberShowcase } from "./useCases/GetMemberShowcase";
import { UpdateMemberShowcase, UpdateMemberShowcaseInput } from "./useCases/UpdateMemberShowcase";
import { DeleteMemberShowcase } from "./useCases/DeleteMemberShowcase";
import { GetSpotlightOfTheDay } from "./useCases/GetSpotlightOfTheDay";
import { MemberShowcaseFilters } from "./domain/IMemberShowcaseRepository";
import { ShowcasedMember } from "./domain/IMembersService";

export interface MemberShowcaseDTO {
  id: string;
  thumbnailUrl: string;
  title: string;
  date: string;
  description: string;
  articleUrl: string;
  showcasedMembers: ShowcasedMember[];
  createdAt: string;
}

export class MemberShowcaseController {
  constructor(
    private readonly createUseCase: CreateMemberShowcase,
    private readonly listUseCase: ListMemberShowcases,
    private readonly getOneUseCase: GetMemberShowcase,
    private readonly updateUseCase: UpdateMemberShowcase,
    private readonly deleteUseCase: DeleteMemberShowcase,
    private readonly getSpotlightUseCase: GetSpotlightOfTheDay
  ) {}

  private toDTO(memberShowcase: MemberShowcase, enrichedMembers: ShowcasedMember[] = []): MemberShowcaseDTO {
    const p = memberShowcase.props;
    return {
      id: p.id,
      thumbnailUrl: p.thumbnailUrl,
      title: p.title,
      date: p.date.toISOString(),
      description: p.description,
      articleUrl: p.articleUrl,
      showcasedMembers: enrichedMembers,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async create(data: CreateMemberShowcaseInput) {
    const result = await this.createUseCase.execute(data);
    return this.toDTO(result);
  }

  async list(pageNumber: number, pageSize: number, filters?: MemberShowcaseFilters) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: list.map(item => this.toDTO(item)),
      count,
    };
  }

  async getOne(id: string) {
    const { showcase, members } = await this.getOneUseCase.execute(id);
    return this.toDTO(showcase, members);
  }

  async update(id: string, updates: UpdateMemberShowcaseInput) {
    const result = await this.updateUseCase.execute(id, updates);
    return this.toDTO(result);
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
    return { success: true };
  }

  async getSpotlight() {
    const { showcase, members } = await this.getSpotlightUseCase.execute();
    if (!showcase) return null;
    return this.toDTO(showcase, members);
  }
}
