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
    } catch (e: any) {
      if (e.message && e.message.includes("not found")) {
        return false;
      }
      console.error(`[TeamModuleAdapter] Unexpected error checking team existence for ID ${id}:`, e);
      throw e;
    }
  }
}
