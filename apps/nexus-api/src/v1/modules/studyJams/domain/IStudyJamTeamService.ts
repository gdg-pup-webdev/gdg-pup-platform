export interface IStudyJamTeamService {
  teamExists(teamId: string): Promise<boolean>;
}
