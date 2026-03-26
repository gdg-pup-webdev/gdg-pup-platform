import { IPortfolioStorage, PortfolioFile, UploadedPortfolioFile } from "../domain/IPortfolioStorage";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

export class PortfolioStorageAdapter implements IPortfolioStorage {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: PortfolioFile): Promise<UploadedPortfolioFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Profile image for: ${file.name}`,
      null,
      "portfolios/profile-images"
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
