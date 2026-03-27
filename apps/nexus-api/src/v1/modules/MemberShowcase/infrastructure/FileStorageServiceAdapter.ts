import { IFileStorageService, FileToUpload, UploadedFile } from "../domain/IFileStorageService";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

export class FileStorageServiceAdapter extends IFileStorageService {
  constructor(private readonly filesController: FilesModuleController) {
    super();
  }

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      "Member Showcase Thumbnail",
      null, // folderId
      "member-showcases" // path
    );

    return new UploadedFile({
      storageReference: result.storageReference,
      publicUrl: result.previewUrl
    });
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    try {
      await this.filesController.deleteFileByPreviewUrl(publicUrl);
      return true;
    } catch (error) {
      return false;
    }
  }
}
