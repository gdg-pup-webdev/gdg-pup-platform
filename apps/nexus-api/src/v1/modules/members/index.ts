import { SupabaseGdgMemberRepository } from "./infrastructure/SupabaseGdgMemberRepository";
import { AddGdgMember } from "./useCases/AddGdgMember";
import { UpdateMemberByGdgId } from "./useCases/UpdateMemberByGdgId";
import { ListGdgMembers } from "./useCases/ListGdgMembers";
import { FindMemberByGdgId } from "./useCases/FindMemberByGdgId";
import { FindMemberByEmail } from "./useCases/FindMemberByEmail";
import { GdgMembersController } from "./GdgMembersController";
import { DeleteGdgMember } from "./useCases/DeleteGdgMember";
import { MakeProfilePrivate } from "./useCases/MakeProfilePrivate";
import { MakeProfilePublic } from "./useCases/MakeProfilePublic";

const repo = new SupabaseGdgMemberRepository();

const addUseCase = new AddGdgMember(repo);
const deleteUseCase = new DeleteGdgMember(repo);
const findByEmailUseCase = new FindMemberByEmail(repo);
const findByGdgIdUseCase = new FindMemberByGdgId(repo);

const listUseCase = new ListGdgMembers(repo);
const updateUseCase = new UpdateMemberByGdgId(repo);

const makeProfilePrivate = new MakeProfilePrivate(repo);
const makeProfilePublic = new MakeProfilePublic(repo);

export const gdgMembersController = new GdgMembersController(
  addUseCase,
  deleteUseCase,
  findByEmailUseCase,
  findByGdgIdUseCase,
  listUseCase,
  updateUseCase,
  makeProfilePrivate,
  makeProfilePublic,
);

export { GdgMembersController };
