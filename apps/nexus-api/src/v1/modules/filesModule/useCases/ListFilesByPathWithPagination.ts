import { FileRecord } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class ListFilesByPathWithPagination {
  constructor(private fileRepository: IFileRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    path: string,
  ): Promise<{
    list: FileRecord[];
    count: number;
  }> {
    /**
     * STEPS:
     * - get files by path with pagination
     */
    const { list, count } = await this.fileRepository.listByPathPaginated(
      pageNumber,
      pageSize,
      path,
    );

    return { list, count };
  }
}
