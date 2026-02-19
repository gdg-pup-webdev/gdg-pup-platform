import { FileRecord  } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class ListFIlesWithPagination {
  constructor(private fileRepository: IFileRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    list: FileRecord[];
    count: number;
  }> {
    /**
     * STEPS:
     * - get file with pagination
     */
    const { list, count } = await this.fileRepository.listPaginated(
      pageNumber,
      pageSize,
    );

    return { list, count };
  }
}
