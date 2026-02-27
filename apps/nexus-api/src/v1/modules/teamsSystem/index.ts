import { SupabaseTeamRepository } from "./infrastructure/SupabaseTeamRepository";
import { SupabaseTeamMemberRepository } from "./infrastructure/SupabaseTeamMemberRepository"; 
import { CreateTeam } from "./useCases/CreateTeam";
import { GetOneTeam } from "./useCases/GetOneTeam";
import { UpdateTeam } from "./useCases/UpdateTeam";
import { DeleteTeam } from "./useCases/DeleteTeam";
import { ListTeams } from "./useCases/ListTeams";

import { AddTeamMember } from "./useCases/AddTeamMember";
import { RemoveTeamMember } from "./useCases/RemoveTeamMember";
import { ListTeamMembers } from "./useCases/ListTeamMembers";
import { SupabaseUserRepository } from "../UserModule/infrastructure/UserRepositoy";
import { TeamModuleController } from "./TeamModuleController";
 
// 1. Repositories (Infrastructure)
const teamRepo = new SupabaseTeamRepository();
const memberRepo = new SupabaseTeamMemberRepository();
const userRepo = new SupabaseUserRepository(); // Injected for cross-validation

// 2. Use Cases (Application)
const createTeamUC = new CreateTeam(teamRepo);
const getOneTeamUC = new GetOneTeam(teamRepo);
const updateTeamUC = new UpdateTeam(teamRepo);
const deleteTeamUC = new DeleteTeam(teamRepo);
const listTeamsUC = new ListTeams(teamRepo);

const addMemberUC = new AddTeamMember(memberRepo, teamRepo, userRepo);
const removeMemberUC = new RemoveTeamMember(memberRepo);
const listMembersUC = new ListTeamMembers(memberRepo);

// 3. Controller Assembly (Presentation)
export const teamModuleController = new TeamModuleController(
  createTeamUC,
  getOneTeamUC,
  updateTeamUC,
  deleteTeamUC,
  listTeamsUC,
  addMemberUC,
  removeMemberUC,
  listMembersUC
);