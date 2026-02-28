import { IStudyJamRepository } from "../domain/IStudyJamRepository";

export class DeleteStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string): Promise<boolean> {
    const studyJam = await this.repo.findById(id);
    if (!studyJam) {
      throw new Error(`Cannot delete: Study Jam with ID ${id} not found.`);
    }

    await this.repo.delete(id);
    return true;
  }
}