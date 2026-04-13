import { randomUUID } from "node:crypto";
import { FileBuffer } from "../domain/FileBuffer";
import { IImageResizer } from "../domain/IImageResizer";
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
    private imageResizer: IImageResizer,
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

    let uploadedFile: UploadedFileBuffer;
    let previewUrl64: string;
    let previewUrl128: string;
    let previewUrl256: string;
    let previewUrl512: string;
    let storageRef64: string;
    let storageRef128: string;
    let storageRef256: string;
    let storageRef512: string;

    if (file.type.startsWith("image/")) {
      const resizedVariants = await this.imageResizer.resizeAndUpload(file);
      const primaryVariant = resizedVariants?.[1024];

      if (!primaryVariant) {
        throw new Error("Failed to generate the 1024px image variant.");
      }

      uploadedFile = primaryVariant;
      const previewUrl1024 = primaryVariant.public_url;
      const storageRef1024 = primaryVariant.storage_reference;

      // Always cascade from larger to smaller resolution.
      previewUrl512 = resizedVariants?.[512]?.public_url ?? previewUrl1024;
      previewUrl256 = resizedVariants?.[256]?.public_url ?? previewUrl512;
      previewUrl128 = resizedVariants?.[128]?.public_url ?? previewUrl256;
      previewUrl64 = resizedVariants?.[64]?.public_url ?? previewUrl128;

      storageRef512 = resizedVariants?.[512]?.storage_reference ?? storageRef1024;
      storageRef256 = resizedVariants?.[256]?.storage_reference ?? storageRef512;
      storageRef128 = resizedVariants?.[128]?.storage_reference ?? storageRef256;
      storageRef64 = resizedVariants?.[64]?.storage_reference ?? storageRef128;
    } else {
      uploadedFile = await this.fileStorage.uploadFileBuffer(file);
      previewUrl512 = uploadedFile.public_url;
      previewUrl256 = previewUrl512;
      previewUrl128 = previewUrl256;
      previewUrl64 = previewUrl128;

      storageRef512 = uploadedFile.storage_reference;
      storageRef256 = storageRef512;
      storageRef128 = storageRef256;
      storageRef64 = storageRef128;
    }

    const fileRecordPrototype: FileRecordPrototype = new FileRecordPrototype({
      fileName,
      fileDescription,
      folderId: finalFolderId,
      previewUrl: uploadedFile.public_url,
      previewUrl64,
      previewUrl128,
      previewUrl256,
      previewUrl512,
      storageReference: uploadedFile.storage_reference,
      storageRef64,
      storageRef128,
      storageRef256,
      storageRef512,
      fileType: file.type,
    });

    const createdFileRecord: FileRecord =
      await this.fileRepository.savePrototype(fileRecordPrototype);

    return createdFileRecord;
  }
}
