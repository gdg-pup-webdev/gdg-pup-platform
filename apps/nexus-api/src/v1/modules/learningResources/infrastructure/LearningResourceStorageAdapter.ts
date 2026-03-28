import { ILearningResourceStorage, FileToUpload, UploadedFile } from "../domain/ILearningResourceStorage";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

/**
 * Adapter that implements the ILearningResourceStorage port using the FilesModuleController.
 */
export class LearningResourceStorageAdapter implements ILearningResourceStorage {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Thumbnail for learning resource: ${file.name}`,
      null,
      "learning-resources/thumbnails"
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
