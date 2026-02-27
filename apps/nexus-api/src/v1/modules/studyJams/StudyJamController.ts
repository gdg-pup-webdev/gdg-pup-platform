import { StudyJamFilters } from "./domain/IStudyJamRepository";
import { StudyJam } from "./domain/StudyJam";
import { CreateStudyJam } from "./useCases/CreateStudyJam";
import { DeleteStudyJam } from "./useCases/DeleteStudyJam";
import { GetOneStudyJam } from "./useCases/GetOneStudyJam";
import { ListStudyJams } from "./useCases/ListStudyJams";
import { UpdateStudyJam } from "./useCases/UpdateStudyJam";

 

export interface StudyJamDTO {
  id: string;
  creatorId: string;
  title: string;
  summary: string;
  description: string;
  createdAt: string;
}

export class StudyJamController {
  constructor(
    private readonly createUseCase: CreateStudyJam,
    private readonly getOneUseCase: GetOneStudyJam,
    private readonly listUseCase: ListStudyJams,
    private readonly updateUseCase: UpdateStudyJam,
    private readonly deleteUseCase: DeleteStudyJam
  ) {}

  private toDTO(studyJam: StudyJam): StudyJamDTO {
    const p = studyJam.props;
    return {
      id: p.id,
      creatorId: p.creatorId,
      title: p.title,
      summary: p.summary,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async create(data: { title: string; summary: string; description: string }, creatorId: string) {
    const studyJam = await this.createUseCase.execute({ ...data, creatorId });
    return this.toDTO(studyJam);
  }

  async getOne(id: string) {
    const studyJam = await this.getOneUseCase.execute(id);
    return this.toDTO(studyJam);
  }

  async list(pageNumber: number, pageSize: number, filters: StudyJamFilters) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: list.map(sj => this.toDTO(sj)),
      count,
    };
  }

  async update(id: string, updates: { title?: string; summary?: string; description?: string }) {
    const studyJam = await this.updateUseCase.execute(id, updates);
    return this.toDTO(studyJam);
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}