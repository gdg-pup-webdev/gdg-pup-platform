import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource } from "../domain/TeamResource";

export class GetTeamResource {
  constructor(private readonly repo: ITeamResourceRepository) {}

  async execute(id: string): Promise<TeamResource> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error("Team resource not found.");
    }
    return resource;
  }
}
