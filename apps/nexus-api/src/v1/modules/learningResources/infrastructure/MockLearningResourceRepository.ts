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
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(r => 
          r.props.title.toLowerCase().includes(s) || 
          r.props.description.toLowerCase().includes(s)
        );
      }
      if (filters.uploaderId) {
        filtered = filtered.filter(r => r.props.uploaderId === filters.uploaderId);
      }
      if (filters.createdFrom) {
        const fromDate = new Date(filters.createdFrom);
        filtered = filtered.filter(r => r.props.createdAt >= fromDate);
      }
      if (filters.createdTo) {
        const toDate = new Date(filters.createdTo);
        filtered = filtered.filter(r => r.props.createdAt <= toDate);
      }
      if (filters.tagIds && filters.tagIds.length > 0) {
        filtered = filtered.filter(r => 
          r.props.tagIds.some(tag => filters.tagIds!.includes(tag))
        );
      }
    }

    // Sort by latest created
    filtered.sort((a, b) => b.props.createdAt.getTime() - a.props.createdAt.getTime());

    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);

    return {
      list: paginated,
      count: filtered.length
    };
  }

  async saveNew(resource: LearningResource): Promise<LearningResource> {
    this.resources.push(resource);
    return resource;
  }

  async persistUpdates(resource: LearningResource): Promise<LearningResource> {
    const idx = this.resources.findIndex(r => r.props.id === resource.props.id);
    if (idx !== -1) {
      this.resources[idx] = resource;
    }
    return resource;
  }

  async delete(id: string): Promise<void> {
    this.resources = this.resources.filter(r => r.props.id !== id);
  }
}