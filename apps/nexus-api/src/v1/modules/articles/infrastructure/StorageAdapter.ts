import { IStorageService, FileToUpload, UploadedFile } from "../domain/IStorageService";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

/**
 * Adapter that implements the IArticleStorage port using the FilesModuleController.
 */
export class StorageAdapter implements IStorageService {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Thumbnail for article: ${file.name}`,
      null,
      "articles/thumbnails"
    );

    return {
      storageReference: result.storageReference,
      publicUrl: result.previewUrl,
    };
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesController.deleteFileByPreviewUrl(publicUrl);
  }
}
