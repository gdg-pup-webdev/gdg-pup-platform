import { randomUUID } from "node:crypto";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileRepository } from "../domain/IFileRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { FileRecord, FileRecordPrototype } from "../domain/FileRecord";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";
import { IFolderRepository } from "../domain/IFolderRepository";
import { Folder } from "../domain/Folder";

export class UploadFile {
  constructor(
    private fileStorage: IFileStorage,
    private fileRepository: IFileRepository,
    private folderRepository: IFolderRepository,
  ) {}

  async execute(
    file: FileBuffer,
    fileName: string,
    fileDescription: string,
    folderId: string | null,
    path?: string,
  ): Promise<FileRecord> {
    let finalFolderId = folderId;

    // If path is provided, resolve folder hierarchy
    if (path) {
      const parts = path.split("/").filter(Boolean);
      let currentParentId: string | null = folderId;

      for (const part of parts) {
        let folder = await this.folderRepository.findByNameAndParent(part, currentParentId);
        
        if (!folder) {
          const id = randomUUID();
          folder = Folder.create({ name: part, parentId: currentParentId }, id);
          folder = await this.folderRepository.save(folder);
        }
        
        currentParentId = folder.props.id;
      }
      finalFolderId = currentParentId;
    }

    const uploadedFile: UploadedFileBuffer =
      await this.fileStorage.uploadFileBuffer(file);

    const fileRecordPrototype: FileRecordPrototype = new FileRecordPrototype({
      fileName,
      fileDescription,
      folderId: finalFolderId,
      previewUrl: uploadedFile.public_url,
      storageReference: uploadedFile.storage_reference,
      fileType: file.type,
    });

    const createdFileRecord: FileRecord =
      await this.fileRepository.savePrototype(fileRecordPrototype);

    return createdFileRecord;
  }
}
