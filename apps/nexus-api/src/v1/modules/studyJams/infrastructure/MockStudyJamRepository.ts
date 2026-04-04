import {
  IStudyJamRepository,
  StudyJamFilters,
} from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class MockStudyJamRepository implements IStudyJamRepository {
  public studyJams: StudyJam[] = [];

  async findById(id: string): Promise<StudyJam | null> {
    return this.studyJams.find((studyJam) => studyJam.props.id === id) ?? null;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    filters: StudyJamFilters = {},
  ): Promise<{ list: StudyJam[]; count: number }> {
    let filtered = [...this.studyJams];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (studyJam) =>
          studyJam.props.title.toLowerCase().includes(term) ||
          studyJam.props.summary.toLowerCase().includes(term) ||
          studyJam.props.description.toLowerCase().includes(term),
      );
    }

    if (filters.createdFrom) {
      const from = new Date(filters.createdFrom).getTime();
      filtered = filtered.filter(
        (studyJam) => studyJam.props.createdAt.getTime() >= from,
      );
    }

    if (filters.createdTo) {
      const to = new Date(filters.createdTo).getTime();
      filtered = filtered.filter(
        (studyJam) => studyJam.props.createdAt.getTime() <= to,
      );
    }

    filtered.sort(
      (left, right) =>
        right.props.createdAt.getTime() - left.props.createdAt.getTime(),
    );

    const fromIndex = (pageNumber - 1) * pageSize;
    return {
      list: filtered.slice(fromIndex, fromIndex + pageSize),
      count: filtered.length,
    };
  }

  async saveNew(studyJam: StudyJam): Promise<StudyJam> {
    this.studyJams.push(studyJam);
    return studyJam;
  }

  async persistUpdates(studyJam: StudyJam): Promise<StudyJam> {
    const index = this.studyJams.findIndex(
      (item) => item.props.id === studyJam.props.id,
    );

    if (index >= 0) {
      this.studyJams[index] = studyJam;
    }

    return studyJam;
  }

  async delete(id: string): Promise<void> {
    this.studyJams = this.studyJams.filter(
      (studyJam) => studyJam.props.id !== id,
    );
  }
}
