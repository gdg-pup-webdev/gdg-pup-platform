export interface PortfolioFile {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

export interface UploadedPortfolioFile {
  storageReference: string;
  publicUrl: string;
}

export interface IPortfolioStorage {
  uploadFile(file: PortfolioFile): Promise<UploadedPortfolioFile>;
  deleteFile(publicUrl: string): Promise<boolean>;
}
