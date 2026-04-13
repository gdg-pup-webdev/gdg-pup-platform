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

    const storageRes = await this.fileStorage.deleteFile(
      fileRecord.props.storageReference,
    );
    fileRecord.markAsDeleted();
    await this.fileRepository.saveUpdates(fileRecord);

    return storageRes;
  }
}
