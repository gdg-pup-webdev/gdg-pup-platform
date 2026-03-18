import { FileRecord } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";
import { IFolderRepository } from "../domain/IFolderRepository";

export class ListFilesByPathWithPagination {
  constructor(
    private fileRepository: IFileRepository,
    private folderRepository: IFolderRepository,
  ) {}

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
     * 1. resolve path to folderId
     * 2. get files by folderId with pagination
     */
    const parts = path.split("/").filter(Boolean);
    let currentFolderId: string | null = null;

    for (const part of parts) {
      const folder = await this.folderRepository.findByNameAndParent(part, currentFolderId);
      if (!folder) {
        return { list: [], count: 0 };
      }
      currentFolderId = folder.props.id;
    }

    const { list, count } = await this.fileRepository.listByFolderPaginated(
      pageNumber,
      pageSize,
      currentFolderId,
    );

    return { list, count };
  }
}
