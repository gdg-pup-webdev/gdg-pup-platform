import { FileRecord, FileRecordUpdateProps } from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository"; 

export class UpdateFileById {
  constructor(private fileRepository: IFileRepository) {}

  async execute(
    fileId: string,
    updateProps: FileRecordUpdateProps,
  ): Promise<FileRecord> {
    /**
     * STEPS:
     * - get file from repo
     * - check if it exists
     * - update the file record
     * - save updates to the repository
     */

    const fileRecord = await this.fileRepository.findById(fileId);

    if (!fileRecord) {
      throw new Error("File not found");
    }

    fileRecord.update(updateProps);

    const updatedFileRecord = await this.fileRepository.saveUpdates(fileRecord);

    return updatedFileRecord;
  }
}
