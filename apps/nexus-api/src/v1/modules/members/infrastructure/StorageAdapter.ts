import { FilesModuleController } from "../../filesModule"; 
import { FileToUpload, IStorageService, UploadedFile } from "../domain/IStorageService";
export class StorageAdapter implements IStorageService {
  constructor(private filesController: FilesModuleController) {}

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Project image: ${file.name}`,
      null, // No specific folder
      "member-projects" // path
    );

    return new UploadedFile({
      storageReference: result.storageReference || "",
      publicUrl: result.previewUrl || "",
    });
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesController.deleteFileByPreviewUrl(publicUrl);
  }
}
