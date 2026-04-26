import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { IFolderRepository } from "../domain/IFolderRepository";

export class DeleteFolderById {
  constructor(
    private folderRepository: IFolderRepository,
    private fileRepository: IFileRepository,
    private fileStorage: IFileStorage,
  ) {}

  async execute(folderId: string): Promise<boolean> {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder) return true;

    // 1. Delete all files in this folder
    let hasMoreFiles = true;
    while (hasMoreFiles) {
      // Always get the first page since we are deleting items
      const { list } = await this.fileRepository.listByFolderPaginated(1, 50, folderId);
      if (list.length === 0) {
        hasMoreFiles = false;
        break;
      }

      for (const file of list) {
        const references = [
          file.props.storageReference,
          file.props.storageRef64,
          file.props.storageRef128,
          file.props.storageRef256,
          file.props.storageRef512,
        ].filter((ref): ref is string => Boolean(ref));

        for (const reference of references) {
          try {
            await this.fileStorage.deleteFile(reference);
          } catch (error) {
            console.error(
              `Failed to delete file from storage: ${reference}`,
              error,
            );
          }
        }

        file.markAsDeleted();
        await this.fileRepository.saveUpdates(file);
      }
    }

    // 2. Delete all subfolders recursively
    let hasMoreFolders = true;
    while (hasMoreFolders) {
      // Always get the first page since we are deleting items
      const { list } = await this.folderRepository.listByParentPaginated(
        1,
        50,
        folderId,
      );
      if (list.length === 0) {
        hasMoreFolders = false;
        break;
      }

      for (const subfolder of list) {
        await this.execute(subfolder.props.id);
      }
    }

    // 3. Delete the folder itself
    await this.folderRepository.deleteById(folderId);

    return true;
  }
}
