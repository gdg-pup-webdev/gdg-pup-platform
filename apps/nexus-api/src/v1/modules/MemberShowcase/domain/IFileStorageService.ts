export interface IFileStorageService {
  getFileUrl(id: string): Promise<string | null>;
  exists(id: string): Promise<boolean>;
}
