import {
  FileToUpload,
  IFileStorage,
  UploadedFile,
} from "../../domain/IFileStorage";

/**
 * Mock implementation of ITeamResourceStorage for testing.
 */
export class MockFileStorageAdapter implements IFileStorage {
  public files: Map<string, ArrayBuffer> = new Map();

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const storageReference = `mock-ref-${file.name}`;
    const publicUrl = `https://mock-url.com/${file.name}`;
    this.files.set(publicUrl, file.buffer);
    return {
      storageReference,
      publicUrl,
    };
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return this.files.delete(publicUrl);
  }

  exists(publicUrl: string): boolean {
    return this.files.has(publicUrl);
  }

  reset(): void {
    this.files.clear();
  }
}
