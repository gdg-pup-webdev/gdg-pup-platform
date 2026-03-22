import { AddGdgMember } from "./useCases/AddGdgMember";
import { UpdateGdgMember } from "./useCases/UpdateGdgMember";
import { DeleteGdgMember } from "./useCases/DeleteGdgMember";
import { GetOneGdgMember } from "./useCases/GetOneGdgMember";
import { ListGdgMembers } from "./useCases/ListGdgMembers";
import { ImportGdgMembersFromCsv } from "./useCases/ImportGdgMembersFromCsv";
import { ExportGdgMembersToCsv } from "./useCases/ExportGdgMembersToCsv";
import { FindMemberByGdgId } from "./useCases/FindMemberByGdgId";
import { GdgMemberFilters } from "./domain/IGdgMemberRepository";

export class GdgMembersController {
  constructor(
    private readonly addUseCase: AddGdgMember,
    private readonly updateUseCase: UpdateGdgMember,
    private readonly deleteUseCase: DeleteGdgMember,
    private readonly getOneUseCase: GetOneGdgMember,
    private readonly listUseCase: ListGdgMembers,
    private readonly importUseCase: ImportGdgMembersFromCsv,
    private readonly exportUseCase: ExportGdgMembersToCsv,
    private readonly findByGdgIdUseCase: FindMemberByGdgId
  ) {}

  async addMember(data: {
    gdgId: string;
    email: string;
    program: string;
    department: string;
    displayName: string;
    firstName: string;
    lastName: string;
    suffix: string | null;
  }) {
    const result = await this.addUseCase.execute(data);
    return result.props;
  }

  async update(id: string, data: {
    gdgId?: string;
    email?: string;
    program?: string;
    department?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    suffix?: string | null;
  }) {
    const result = await this.updateUseCase.execute(id, data);
    return result.props;
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
    return { success: true };
  }

  async getOne(id: string) {
    const result = await this.getOneUseCase.execute(id);
    return result ? result.props : null;
  }

  async findByGdgId(gdgId: string) {
    const result = await this.findByGdgIdUseCase.execute(gdgId);
    return result ? result.props : null;
  }

  async list(pageNumber: number, pageSize: number, filters?: GdgMemberFilters) {
    const result = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: result.list.map(m => m.props),
      count: result.count
    };
  }

  async importFromCsv(csvContent: string) {
    return await this.importUseCase.execute(csvContent);
  }

  async exportToCsv() {
    return await this.exportUseCase.execute();
  }
}
