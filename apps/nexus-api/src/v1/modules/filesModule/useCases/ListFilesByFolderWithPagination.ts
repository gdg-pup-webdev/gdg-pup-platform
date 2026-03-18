import { FileRecord } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

export class ListFilesByFolderWithPagination {
  constructor(private fileRepository: IFileRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    folderId: string | null,
  ): Promise<{
    list: FileRecord[];
    count: number;
  }> {
    const { list, count } = await this.fileRepository.listByFolderPaginated(
      pageNumber,
      pageSize,
      folderId,
    );

    return { list, count };
  }
}
