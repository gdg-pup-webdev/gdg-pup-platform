 import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";

export class DeleteFileById {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorage: IFileStorage,
  ) {}

  async execute(fileId: string): Promise<boolean> {
    /**
     * STEPS:
     * - get file from repo
     * - check if it exists
     * - get the storage reference
     * - use the reference to delete file
     * - after deleting file, delete the file record
     */

    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      return true;
    }

    const references = [
      file.props.storageReference,
      file.props.storageRef64,
      file.props.storageRef128,
      file.props.storageRef256,
      file.props.storageRef512,
    ].filter((ref): ref is string => Boolean(ref));

    await Promise.all(
      references.map((reference) => this.fileStorage.deleteFile(reference)),
    );

    file.markAsDeleted();
    await this.fileRepository.saveUpdates(file);

    return true;
  }
}
