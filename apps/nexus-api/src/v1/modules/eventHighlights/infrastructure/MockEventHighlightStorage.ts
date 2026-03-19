import { IEventHighlightStorage, EventHighlightFile, UploadedEventHighlightFile } from "../domain/IEventHighlightStorage";

export class MockEventHighlightStorage implements IEventHighlightStorage {
  async uploadFile(file: EventHighlightFile): Promise<UploadedEventHighlightFile> {
    return {
      storageReference: `mock-ref/${file.name}`,
      publicUrl: `https://mock-url.com/${file.name}`,
    };
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return true;
  }
}
