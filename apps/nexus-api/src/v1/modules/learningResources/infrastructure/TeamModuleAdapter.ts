import { ITeamModule } from "../domain/ITeamModule";
import { TeamModuleController } from "../../teamsSystem/TeamModuleController";

/**
 * Adapter that implements the ITeamModule port using the TeamModuleController.
 */
export class TeamModuleAdapter implements ITeamModule {
  constructor(private readonly teamController: TeamModuleController) {}

  async existsById(id: string): Promise<boolean> {
    try {
      const team = await this.teamController.getTeam(id);
      return !!team;
    } catch (e) {
      return false;
    }
  }
}
