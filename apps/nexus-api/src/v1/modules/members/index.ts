import { AddGdgMember } from "./useCases/AddGdgMember";
import { UpdateMemberByGdgId } from "./useCases/UpdateMemberByGdgId";
import { ListGdgMembers } from "./useCases/ListGdgMembers";
import { FindMemberByGdgId } from "./useCases/FindMemberByGdgId";
import { FindMemberByEmail } from "./useCases/FindMemberByEmail";
import { GdgMembersController } from "./GdgMembersController";
import { DeleteGdgMember } from "./useCases/DeleteGdgMember";
import { MakeProfilePrivate } from "./useCases/MakeProfilePrivate";
import { MakeProfilePublic } from "./useCases/MakeProfilePublic";
import { SupabaseGdgMemberRepository } from "./infrastructure/SupabaseGdgMemberRepository";
import { SearchMember } from "./useCases/SearchMember";
import { ChangeProfilePicture } from "./useCases/ChangeProfilePicture";
import { StorageAdapter } from "./infrastructure/StorageAdapter";
import { filesModuleController } from "../filesModule";
import { GetSimilarUsers } from "./useCases/GetSimilarUsers";

const repo = new SupabaseGdgMemberRepository();
const storage = new StorageAdapter(filesModuleController);

const addUseCase = new AddGdgMember(repo);
const deleteUseCase = new DeleteGdgMember(repo);
const findByEmailUseCase = new FindMemberByEmail(repo);
const findByGdgIdUseCase = new FindMemberByGdgId(repo);

const listUseCase = new ListGdgMembers(repo);
const updateUseCase = new UpdateMemberByGdgId(repo);

const makeProfilePrivate = new MakeProfilePrivate(repo);
const makeProfilePublic = new MakeProfilePublic(repo);

const searchUC = new SearchMember(repo);
const suggestedUsersUseCase = new GetSimilarUsers(repo);

const changepfpuc = new ChangeProfilePicture(storage, repo);

export const gdgMembersController = new GdgMembersController(
  addUseCase,
  deleteUseCase,
  findByEmailUseCase,
  findByGdgIdUseCase,
  listUseCase,
  updateUseCase,
  makeProfilePrivate,
  makeProfilePublic,
  searchUC,
  changepfpuc,
  suggestedUsersUseCase,
);

export { GdgMembersController };
