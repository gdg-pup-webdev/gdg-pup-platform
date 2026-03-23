import { SupabaseGdgMemberRepository } from "./infrastructure/SupabaseGdgMemberRepository";
import { AddGdgMember } from "./useCases/AddGdgMember";
import { UpdateGdgMember } from "./useCases/UpdateGdgMember";
import { DeleteGdgMember } from "./useCases/DeleteGdgMember";
import { GetOneGdgMember } from "./useCases/GetOneGdgMember";
import { ListGdgMembers } from "./useCases/ListGdgMembers";
import { ImportGdgMembersFromCsv } from "./useCases/ImportGdgMembersFromCsv";
import { ExportGdgMembersToCsv } from "./useCases/ExportGdgMembersToCsv";
import { FindMemberByGdgId } from "./useCases/FindMemberByGdgId";
import { FindMemberByEmail } from "./useCases/FindMemberByEmail";
import { GdgMembersController } from "./GdgMembersController";

const repo = new SupabaseGdgMemberRepository();

const addUseCase = new AddGdgMember(repo);
const updateUseCase = new UpdateGdgMember(repo);
const deleteUseCase = new DeleteGdgMember(repo);
const getOneUseCase = new GetOneGdgMember(repo);
const listUseCase = new ListGdgMembers(repo);
const importUseCase = new ImportGdgMembersFromCsv(repo);
const exportUseCase = new ExportGdgMembersToCsv(repo);
const findByGdgIdUseCase = new FindMemberByGdgId(repo);
const findByEmailUseCase = new FindMemberByEmail(repo);

export const gdgMembersController = new GdgMembersController(
  addUseCase,
  updateUseCase,
  deleteUseCase,
  getOneUseCase,
  listUseCase,
  importUseCase,
  exportUseCase,
  findByGdgIdUseCase,
  findByEmailUseCase
);

export { GdgMembersController };
export * from "./domain/GdgMember";
export * from "./domain/IGdgMemberRepository";
export * from "./useCases/AddGdgMember";
export * from "./useCases/UpdateGdgMember";
export * from "./useCases/DeleteGdgMember";
export * from "./useCases/GetOneGdgMember";
export * from "./useCases/ListGdgMembers";
export * from "./useCases/ImportGdgMembersFromCsv";
export * from "./useCases/ExportGdgMembersToCsv";
export * from "./useCases/FindMemberByGdgId";
