import { FilesModuleController } from "../../filesModule";
import { FileToUpload, IFileStorage, UploadedFile } from "../domain/IFileStorage";

 
/**
 * Adapter that implements the IFileStorage port using the FilesModuleController.
 */
export class FileStorageAdapter implements IFileStorage {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Thumbnail for team resource: ${file.name}`,
      null,
      "events/thumbnails"
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
