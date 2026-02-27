import { IStudyJamRepository, StudyJamFilters } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class MockStudyJamRepository implements IStudyJamRepository {
  public studyJams: StudyJam[] = [];

  async findById(id: string): Promise<StudyJam | null> {
    return this.studyJams.find(sj => sj.props.id === id) || null;
  }

  async findAll(pageNumber: number, pageSize: number, filters?: StudyJamFilters): Promise<{ list: StudyJam[]; count: number }> {
    let filtered = this.studyJams;

    if (filters) {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(sj => 
          sj.props.title.toLowerCase().includes(term) || 
          sj.props.summary.toLowerCase().includes(term) ||
          sj.props.description.toLowerCase().includes(term)
        );
      }
      if (filters.createdFrom) {
        const fromDate = new Date(filters.createdFrom);
        filtered = filtered.filter(sj => sj.props.createdAt >= fromDate);
      }
      if (filters.createdTo) {
        const toDate = new Date(filters.createdTo);
        filtered = filtered.filter(sj => sj.props.createdAt <= toDate);
      }
    }

    filtered.sort((a, b) => b.props.createdAt.getTime() - a.props.createdAt.getTime());

    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);

    return { list: paginated, count: filtered.length };
  }

  async saveNew(studyJam: StudyJam): Promise<StudyJam> {
    this.studyJams.push(studyJam);
    return studyJam;
  }

  async persistUpdates(studyJam: StudyJam): Promise<StudyJam> {
    const idx = this.studyJams.findIndex(sj => sj.props.id === studyJam.props.id);
    if (idx !== -1) {
      this.studyJams[idx] = studyJam;
    }
    return studyJam;
  }

  async delete(id: string): Promise<void> {
    this.studyJams = this.studyJams.filter(sj => sj.props.id !== id);
  }
}