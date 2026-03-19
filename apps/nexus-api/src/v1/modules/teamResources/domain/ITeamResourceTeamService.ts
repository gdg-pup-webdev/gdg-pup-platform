/**
 * @file ITeamResourceTeamService.ts
 * @description Port for external team-related operations required by the Team Resource module.
 */

export abstract class ITeamResourceTeamService {
  /**
   * Checks if a team with the given name exists.
   */
  abstract existsByName(name: string): Promise<boolean>;
}
