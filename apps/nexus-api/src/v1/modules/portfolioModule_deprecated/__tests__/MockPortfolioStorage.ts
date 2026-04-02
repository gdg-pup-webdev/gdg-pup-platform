import { IPortfolioStorage, PortfolioFile, UploadedPortfolioFile } from "../domain/IPortfolioStorage";

export class MockPortfolioStorage implements IPortfolioStorage {
  async uploadFile(file: PortfolioFile): Promise<UploadedPortfolioFile> {
    return {
      storageReference: `mock-ref-${file.name}`,
      publicUrl: `https://mock-storage.com/${file.name}`,
    };
  }

  async deleteFile(_publicUrl: string): Promise<boolean> {
    return true;
  }
}
