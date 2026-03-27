import { IFileStorageService } from "../domain/IFileStorageService";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

export class FileStorageServiceAdapter implements IFileStorageService {
  constructor(private readonly filesController: FilesModuleController) {}

  async getFileUrl(id: string): Promise<string | null> {
    try {
      const file = await this.filesController.getOneFileById(id);
      return file.previewUrl;
    } catch (error) {
      return null;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const file = await this.filesController.getOneFileById(id);
      return !!file;
    } catch (error) {
      return false;
    }
  }
}
