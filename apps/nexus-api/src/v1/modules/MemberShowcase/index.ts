import { SupabaseMemberShowcaseRepository } from "./infrastructure/SupabaseMemberShowcaseRepository";
import { MembersServiceAdapter } from "./infrastructure/MembersServiceAdapter";
import { FileStorageServiceAdapter } from "./infrastructure/FileStorageServiceAdapter";
import { gdgMembersController } from "../members";
import { filesModuleController } from "../filesModule";
import { CreateMemberShowcase } from "./useCases/CreateMemberShowcase";
import { ListMemberShowcases } from "./useCases/ListMemberShowcases";
import { GetMemberShowcase } from "./useCases/GetMemberShowcase";
import { UpdateMemberShowcase } from "./useCases/UpdateMemberShowcase";
import { DeleteMemberShowcase } from "./useCases/DeleteMemberShowcase";
import { GetSpotlightOfTheDay } from "./useCases/GetSpotlightOfTheDay";
import { MemberShowcaseController } from "./MemberShowcaseController";

// Infrastructure
const repo = new SupabaseMemberShowcaseRepository();
const membersService = new MembersServiceAdapter(gdgMembersController);
const fileStorageService = new FileStorageServiceAdapter(filesModuleController);

// Use Cases
const createUseCase = new CreateMemberShowcase(repo, fileStorageService);
const listUseCase = new ListMemberShowcases(repo);
const getOneUseCase = new GetMemberShowcase(repo, membersService);
const updateUseCase = new UpdateMemberShowcase(repo, fileStorageService);
const deleteUseCase = new DeleteMemberShowcase(repo, fileStorageService);
const getSpotlightUseCase = new GetSpotlightOfTheDay(repo, membersService);

// Controller
export const memberShowcaseController = new MemberShowcaseController(
  createUseCase,
  listUseCase,
  getOneUseCase,
  updateUseCase,
  deleteUseCase,
  getSpotlightUseCase,
  membersService
);

export { MemberShowcaseController };
export * from "./domain/MemberShowcase";
export * from "./domain/IMemberShowcaseRepository";
export * from "./domain/IFileStorageService";
