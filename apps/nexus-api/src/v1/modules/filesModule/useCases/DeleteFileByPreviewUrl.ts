import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";

export class DeleteFileByPreviewUrl {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorage: IFileStorage,
  ) {}

  async execute(publicUrl: string): Promise<boolean> {
    const fileRecord = await this.fileRepository.findByPreviewUrl(publicUrl);

    if (!fileRecord) {
      return true;
    }

    const references = [
      fileRecord.props.storageReference,
      fileRecord.props.storageRef64,
      fileRecord.props.storageRef128,
      fileRecord.props.storageRef256,
      fileRecord.props.storageRef512,
    ].filter((ref): ref is string => Boolean(ref));

    const storageResults = await Promise.all(
      references.map((reference) => this.fileStorage.deleteFile(reference)),
    );

    fileRecord.markAsDeleted();
    await this.fileRepository.saveUpdates(fileRecord);

    return storageResults.every(Boolean);
  }
}
