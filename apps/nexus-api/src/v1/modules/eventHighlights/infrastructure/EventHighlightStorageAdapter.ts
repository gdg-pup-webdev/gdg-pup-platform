import { IEventHighlightStorage, EventHighlightFile, UploadedEventHighlightFile } from "../domain/IEventHighlightStorage";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

/**
 * Adapter that implements the IEventHighlightStorage port using the FilesModuleController.
 */
export class EventHighlightStorageAdapter implements IEventHighlightStorage {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: EventHighlightFile): Promise<UploadedEventHighlightFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Thumbnail for event highlight: ${file.name}`,
      null,
      "event-highlights/thumbnails"
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
