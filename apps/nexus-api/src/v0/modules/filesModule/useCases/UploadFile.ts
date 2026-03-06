import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { FileRecord, FileRecordPrototype } from "../domain/FileRecord";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";

export class UploadFile {
  constructor(
    private fileStorage: IFileStorage,
    private fileRepository: IFileRepository,
  ) {}

  async execute(
    file: FileBuffer,
    fileName: string,
    fileDescription: string,
    filePath: string,
  ): Promise<FileRecord> {
    // STEPS:
    // upload file to storage
    // create prototype of file object
    // save file object in db
    // return file object

    const uploadedFile: UploadedFileBuffer =
      await this.fileStorage.uploadFileBuffer(file);

    const fileRecordPrototype: FileRecordPrototype = new FileRecordPrototype({
      fileName,
      fileDescription,
      filePath,
      previewUrl: uploadedFile.public_url,
      storageReference: uploadedFile.storage_reference,
    });

    const createdFileRecord: FileRecord =
      await this.fileRepository.savePrototype(fileRecordPrototype);

    return createdFileRecord;
  }
}
