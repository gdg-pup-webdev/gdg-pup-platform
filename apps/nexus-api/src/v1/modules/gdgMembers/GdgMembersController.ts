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
  ) {}

  private flattenMemberData(data: GdgMember) {
    return data.props;
  }

  async addMember(data: AddGdgMemberInput) {
    const result = await this.addUseCase.execute(data);
    return result.props;
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
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

  async update(gdgId: string, data: GdgMemberUpdateProps) {
    const result = await this.updateMemberByGdgIdUseCase.execute(gdgId, data);
    return result.props;
  }

  async makeProfilePrivate(gdgId: string) {
    await this.makeProfilePrivateUseCase.execute(gdgId);
    return { success: true };
  }

  async makeProfilePublic(gdgId: string) {
    await this.makeProfilePublicUseCase.execute(gdgId);
    return { success: true };
  }
}
