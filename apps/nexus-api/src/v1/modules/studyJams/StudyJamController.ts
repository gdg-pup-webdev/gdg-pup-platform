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
  createdAt: Date;
}

export type StudyJamCreateInput = {
  title: string;
  summary: string;
  description: string;
};

export type StudyJamUpdateInput = Partial<StudyJamCreateInput>;

export class StudyJamController {
  constructor(
    private readonly createUseCase: CreateStudyJam,
    private readonly getOneUseCase: GetOneStudyJam,
    private readonly listUseCase: ListStudyJams,
    private readonly updateUseCase: UpdateStudyJam,
    private readonly deleteUseCase: DeleteStudyJam,
  ) {}

  private toDTO(studyJam: StudyJam): StudyJamDTO {
    return {
      id: studyJam.props.id,
      creatorId: studyJam.props.creatorId,
      title: studyJam.props.title,
      summary: studyJam.props.summary,
      description: studyJam.props.description,
      createdAt: studyJam.props.createdAt,
    };
  }

  async create(
    input: StudyJamCreateInput,
    creatorId: string,
  ): Promise<StudyJamDTO> {
    const studyJam = await this.createUseCase.execute({
      ...input,
      creatorId,
    });

    return this.toDTO(studyJam);
  }

  async getOne(id: string): Promise<StudyJamDTO> {
    const studyJam = await this.getOneUseCase.execute(id);
    return this.toDTO(studyJam);
  }

  async list(
    pageNumber: number,
    pageSize: number,
    filters: StudyJamFilters = {},
  ): Promise<{ list: StudyJamDTO[]; count: number }> {
    const { list, count } = await this.listUseCase.execute(
      pageNumber,
      pageSize,
      filters,
    );
    return {
      list: list.map((studyJam) => this.toDTO(studyJam)),
      count,
    };
  }

  async update(id: string, updates: StudyJamUpdateInput): Promise<StudyJamDTO> {
    const studyJam = await this.updateUseCase.execute(id, updates);
    return this.toDTO(studyJam);
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteUseCase.execute(id);
  }
}
