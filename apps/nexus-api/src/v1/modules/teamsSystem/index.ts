import { SupabaseTeamRepository } from "./infrastructure/SupabaseTeamRepository";
import { SupabaseTeamMemberRepository } from "./infrastructure/SupabaseTeamMemberRepository"; 
import { CreateTeam } from "./useCases/CreateTeam";
import { GetOneTeam } from "./useCases/GetOneTeam";
import { UpdateTeam } from "./useCases/UpdateTeam";
import { DeleteTeam } from "./useCases/DeleteTeam";
import { ListTeams } from "./useCases/ListTeams";
import { SearchTeams } from "./useCases/SearchTeams";
import { CheckTeamExistsByName } from "./useCases/CheckTeamExistsByName";

import { AddTeamMember } from "./useCases/AddTeamMember";
import { GetOneTeamMember } from "./useCases/GetOneTeamMember";
import { RemoveTeamMember } from "./useCases/RemoveTeamMember";
import { ListTeamMembers } from "./useCases/ListTeamMembers";
import { UpdateTeamMember } from "./useCases/UpdateTeamMember"; 
import { TeamModuleController } from "./TeamModuleController";
import { UserRepository } from "./infrastructure/UserRepository";
 
// 1. Repositories (Infrastructure)
const teamRepo = new SupabaseTeamRepository();
const memberRepo = new SupabaseTeamMemberRepository();
const userRepo = new UserRepository(); // Injected for cross-validation

// 2. Use Cases (Application)
const createTeamUC = new CreateTeam(teamRepo);
const getOneTeamUC = new GetOneTeam(teamRepo);
const updateTeamUC = new UpdateTeam(teamRepo);
const deleteTeamUC = new DeleteTeam(teamRepo);
const listTeamsUC = new ListTeams(teamRepo);
const searchTeamsUC = new SearchTeams(teamRepo);
const checkTeamExistsByNameUC = new CheckTeamExistsByName(teamRepo);

const addMemberUC = new AddTeamMember(memberRepo, teamRepo, userRepo);
const removeMemberUC = new RemoveTeamMember(memberRepo);
const updateMemberUC = new UpdateTeamMember(memberRepo);
const listMembersUC = new ListTeamMembers(memberRepo);
const getOneMemberUC = new GetOneTeamMember(memberRepo);

// 3. Controller Assembly (Presentation)
export const teamModuleController = new TeamModuleController(
  createTeamUC,
  getOneTeamUC,
  updateTeamUC,
  deleteTeamUC,
  listTeamsUC,
  searchTeamsUC,
  checkTeamExistsByNameUC,
  addMemberUC,
  removeMemberUC,
  updateMemberUC,
  listMembersUC,
  getOneMemberUC
);
