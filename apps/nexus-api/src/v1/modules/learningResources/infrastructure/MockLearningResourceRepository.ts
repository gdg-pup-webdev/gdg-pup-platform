import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class MockLearningResourceRepository implements ILearningResourceRepository {
  public resources: LearningResource[] = [];

  async findById(id: string): Promise<LearningResource | null> {
    return this.resources.find(r => r.props.id === id) || null;
  }

  async findAll(pageNumber: number, pageSize: number, filters?: LearningResourceFilters): Promise<{ list: LearningResource[]; count: number }> {
    let filtered = this.resources;

    if (filters) {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(r => 
          r.props.title.toLowerCase().includes(term) || 
          r.props.description.toLowerCase().includes(term)
        );
      }
      if (filters.teamId) {
        filtered = filtered.filter(r => r.props.teamId === filters.teamId);
      }
      if (filters.teamName) {
        // In mock, we can just check team object if it exists or teamId
        filtered = filtered.filter(r => r.props.team?.name === filters.teamName);
      }
      if (filters.eventId) {
        filtered = filtered.filter(r => r.props.eventId === filters.eventId);
      }
    }

    filtered.sort((a, b) => b.props.updatedAt.getTime() - a.props.updatedAt.getTime());

    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);

    return { list: paginated, count: filtered.length };
  }

  async findByTag(tag: string, pageNumber: number, pageSize: number): Promise<{ list: LearningResource[]; count: number }> {
    const filtered = this.resources.filter(r => r.props.tags.includes(tag));
    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);
    return { list: paginated, count: filtered.length };
  }

  async search(query: string, limit: number): Promise<LearningResource[]> {
    const term = query.toLowerCase();
    return this.resources.filter(r => 
      r.props.title.toLowerCase().includes(term) || 
      r.props.description.toLowerCase().includes(term)
    ).slice(0, limit);
  }

  async saveNew(learningResource: LearningResource): Promise<LearningResource> {
    this.resources.push(learningResource);
    return learningResource;
  }

  async persistUpdates(learningResource: LearningResource): Promise<LearningResource> {
    const idx = this.resources.findIndex(r => r.props.id === learningResource.props.id);
    if (idx !== -1) {
      this.resources[idx] = learningResource;
    }
    return learningResource;
  }

  async delete(id: string): Promise<void> {
    this.resources = this.resources.filter(r => r.props.id !== id);
  }
}
