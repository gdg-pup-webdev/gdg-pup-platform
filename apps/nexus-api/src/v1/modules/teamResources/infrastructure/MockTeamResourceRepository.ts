import { ITeamResourceRepository, TeamResourceFilters } from "../domain/ITeamResourceRepository";
import { TeamResource } from "../domain/TeamResource";

export class MockTeamResourceRepository implements ITeamResourceRepository {
  public resources: TeamResource[] = [];

  async findById(id: string): Promise<TeamResource | null> {
    return this.resources.find(r => r.props.id === id) || null;
  }

  async findAll(pageNumber: number, pageSize: number, filters?: TeamResourceFilters): Promise<{ list: TeamResource[]; count: number }> {
    let filtered = this.resources;

    if (filters) {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(r => 
          r.props.title.toLowerCase().includes(term) || 
          r.props.description.toLowerCase().includes(term)
        );
      }
      if (filters.teamName) {
        filtered = filtered.filter(r => r.props.teamName === filters.teamName);
      }
      if (filters.resourceType) {
        filtered = filtered.filter(r => r.props.resourceType === filters.resourceType);
      }
    }

    filtered.sort((a, b) => b.props.updatedAt.getTime() - a.props.updatedAt.getTime());

    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);

    return { list: paginated, count: filtered.length };
  }

  async saveNew(teamResource: TeamResource): Promise<TeamResource> {
    this.resources.push(teamResource);
    return teamResource;
  }

  async persistUpdates(teamResource: TeamResource): Promise<TeamResource> {
    const idx = this.resources.findIndex(r => r.props.id === teamResource.props.id);
    if (idx !== -1) {
      this.resources[idx] = teamResource;
    }
    return teamResource;
  }

  async delete(id: string): Promise<void> {
    this.resources = this.resources.filter(r => r.props.id !== id);
  }
}
