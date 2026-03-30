import { filesModuleController } from "../filesModule";
import { FileStorageAdapter } from "./infrastructure/FileStorageAdapter";
import { MemberProjectRepository } from "./infrastructure/IMemberProjectRepository";
import { MemberAdapter } from "./infrastructure/MemberAdapter";
import { MemberProjectsController } from "./MemberProjectsController";
import { CreateMemberProject } from "./useCases/CreateMemberProject";
import { DeleteMemberProject } from "./useCases/DeleteMemberProject";
import { GetMemberProject } from "./useCases/GetMemberProject";
import { GetMemberProjectsByGdgId } from "./useCases/GetMemberProjectsByGdgId";
import { ListMemberProjects } from "./useCases/ListMemberProjects";
import { UpdateMemberProject } from "./useCases/UpdateMemberProject";
import { SearchMemberProjects } from "./useCases/SearchMemberProjects";
import { GetRandomMemberProjects } from "./useCases/GetRandomMemberProjects";

const repo = new MemberProjectRepository();
const storage = new FileStorageAdapter(filesModuleController);
const member = new MemberAdapter();

const createUC = new CreateMemberProject(repo, storage, member);
const updateUC = new UpdateMemberProject(repo, storage);
const deleteUC = new DeleteMemberProject(repo);
const getOneUC = new GetMemberProject(repo);
const listUC = new ListMemberProjects(repo);
const getByMemberUC = new GetMemberProjectsByGdgId(repo);
const searchUC = new SearchMemberProjects(repo);
const randomUC = new GetRandomMemberProjects(repo);

export const memberProjectsController = new MemberProjectsController(
  createUC,
  updateUC,
  deleteUC,
  getOneUC,
  listUC,
  getByMemberUC,
  searchUC,
  randomUC
);
