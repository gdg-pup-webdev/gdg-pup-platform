import { AddGdgMember, AddGdgMemberInput } from "./useCases/AddGdgMember";
import { UpdateMemberByGdgId } from "./useCases/UpdateMemberByGdgId";
import { ListGdgMembers } from "./useCases/ListGdgMembers";
import { FindMemberByGdgId } from "./useCases/FindMemberByGdgId";
import { FindMemberByEmail } from "./useCases/FindMemberByEmail";
import { GdgMemberFilters } from "./domain/IGdgMemberRepository";
import { DeleteGdgMember } from "./useCases/DeleteGdgMember";
import { GdgMember, GdgMemberUpdateProps } from "./domain/GdgMember";
import { MakeProfilePrivate } from "./useCases/MakeProfilePrivate";
import { MakeProfilePublic } from "./useCases/MakeProfilePublic";
import { SearchMember } from "./useCases/SearchMember";
import { ChangeProfilePicture } from "./useCases/ChangeProfilePicture";
import {
  GetSimilarUsers,
  SimilarUsersStrategy,
} from "./useCases/GetSimilarUsers";

export class GdgMembersController {
  constructor(
    private readonly addUseCase: AddGdgMember,
    private readonly deleteUseCase: DeleteGdgMember,
    private readonly findByEmailUseCase: FindMemberByEmail,
    private readonly findByGdgIdUseCase: FindMemberByGdgId,
    private readonly listUseCase: ListGdgMembers,
    private readonly updateMemberByGdgIdUseCase: UpdateMemberByGdgId,
    private readonly makeProfilePrivateUseCase: MakeProfilePrivate,
    private readonly makeProfilePublicUseCase: MakeProfilePublic,
    private readonly searchUseCase: SearchMember,
    private readonly changePfpUseCase: ChangeProfilePicture,
    private readonly getSuggestedUsersUseCase: GetSimilarUsers,
  ) {}

  private flattenMemberData(data: GdgMember) {
    return data.props;
  }

  async changeProfilePicture(actorId: string, gdgId: string, file: File) {
    const result = await this.changePfpUseCase.execute(actorId, gdgId, {
      buffer: await file.arrayBuffer(),
      name: file.name,
      type: file.type,
    });

    return this.flattenMemberData(result);
  }

  async search(query: string, limit: number) {
    const result = await this.searchUseCase.execute(query, limit);
    return result.map((m) => m.props);
  }

  async getSuggestedUsers(
    gdgId: string,
    pageNumber: number,
    pageSize: number,
    strategy: SimilarUsersStrategy = "exploratory",
  ) {
    const result = await this.getSuggestedUsersUseCase.execute(
      gdgId,
      pageNumber,
      pageSize,
      strategy,
    );
    return {
      list: result.list.map((m) => m.props),
      count: result.count,
    };
  }

  async addMember(data: AddGdgMemberInput) {
    const result = await this.addUseCase.execute(data);
    return result.props;
  }

  async delete(actorId: string, id: string) {
    await this.deleteUseCase.execute(actorId, id);
    return { success: true };
  }

  async findByEmail(email: string) {
    const result = await this.findByEmailUseCase.execute(email);
    return result ? result.props : null;
  }

  async findByGdgId(gdgId: string) {
    const result = await this.findByGdgIdUseCase.execute(gdgId);
    return result ? result.props : null;
  }

  async list(pageNumber: number, pageSize: number, filters?: GdgMemberFilters) {
    const result = await this.listUseCase.execute(
      pageNumber,
      pageSize,
      filters,
    );
    return {
      list: result.list.map((m) => m.props),
      count: result.count,
    };
  }

  async update(actorId: string, gdgId: string, data: GdgMemberUpdateProps) {
    const result = await this.updateMemberByGdgIdUseCase.execute(
      actorId,
      gdgId,
      data,
    );
    return result.props;
  }

  async makeProfilePrivate(actorId: string, gdgId: string) {
    await this.makeProfilePrivateUseCase.execute(actorId, gdgId);
    return { success: true };
  }

  async makeProfilePublic(actorId: string, gdgId: string) {
    await this.makeProfilePublicUseCase.execute(actorId, gdgId);
    return { success: true };
  }
}
