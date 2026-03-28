import { ILearningResourceStorage, FileToUpload, UploadedFile } from "../domain/ILearningResourceStorage";

/**
 * Mock implementation of ILearningResourceStorage for testing.
 */
export class MockLearningResourceStorage implements ILearningResourceStorage {
  public files: Map<string, ArrayBuffer> = new Map();

  async uploadFile(file: FileToUpload): Promise<UploadedFile> {
    const storageReference = `mock-ref-${file.name}`;
    const publicUrl = `https://mock-url.com/${file.name}`;
    this.files.set(publicUrl, file.buffer);
    return new UploadedFile({
      storageReference,
      publicUrl,
    });
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
