import { ITeamResourceTeamService } from "../domain/ITeamResourceTeamService";
import { TeamModuleController } from "../../teamsSystem/TeamModuleController";

/**
 * Adapter that implements the ITeamResourceTeamService port by delegating to the Teams module controller.
 */
export class TeamResourceTeamServiceAdapter implements ITeamResourceTeamService {
  constructor(private readonly teamController: TeamModuleController) {}

  async existsByName(name: string): Promise<boolean> {
    return await this.teamController.existsByName(name);
  }
}
