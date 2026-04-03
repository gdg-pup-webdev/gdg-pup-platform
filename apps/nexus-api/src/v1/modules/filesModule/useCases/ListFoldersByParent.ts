import { Folder } from "../domain/Folder";
import { IFolderRepository } from "../domain/IFolderRepository";

export class ListFoldersByParent {
  constructor(private folderRepository: IFolderRepository) {}

  async execute(
    page: number,
    pageSize: number,
    parentId: string | null,
  ): Promise<{ list: Folder[]; count: number }> {
    return this.folderRepository.listByParentPaginated(page, pageSize, parentId);
  }
}
