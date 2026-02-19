import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";

export class MockFileStorage implements IFileStorage {
  /**
   * Internal "database" to track what has been uploaded 
   * Useful for assertions in your tests.
   */
  public uploadedFiles: Map<string, FileBuffer> = new Map();

  async uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    // 1. Generate a unique reference (simulating a path in a bucket)
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/\s+/g, "_");
    const storageReference = `mock-storage/${timestamp}-${sanitizedName}`;

    // 2. Simulate a public URL
    const publicUrl = `https://mock-storage.provider.com/${storageReference}`;

    // 3. (Optional) Store the buffer internally if you need to 
    // verify the content of the "uploaded" file later in tests.
    this.uploadedFiles.set(storageReference, file);

    // 4. Return the metadata
    return new UploadedFileBuffer(storageReference, publicUrl);
  }

  async deleteFile(storageReference: string): Promise<boolean> {
    // If the file exists in our mock map, remove it
    if (this.uploadedFiles.has(storageReference)) {
      this.uploadedFiles.delete(storageReference);
      return true;
    }

    // Even if it doesn't exist, most storage APIs return true/success 
    // or you can return false to simulate a 404.
    return false;
  }
}