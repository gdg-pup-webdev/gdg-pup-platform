import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";

/**
 * Hybrid storage implementation for migration periods where files can live
 * in both Supabase and GCS. Uploads default to GCS while delete operations
 * route to the proper backend based on storage reference format.
 */
export class HybridFileStorage implements IFileStorage {
  constructor(
    private readonly gcsStorage: IFileStorage,
    private readonly supabaseStorage: IFileStorage,
  ) {}

  async uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    try {
      return await this.gcsStorage.uploadFileBuffer(file);
    } catch (error) {
      console.warn(
        "GCS upload failed in HybridFileStorage; falling back to Supabase storage.",
        error,
      );
      return this.supabaseStorage.uploadFileBuffer(file);
    }
  }

  async deleteFile(storageReference: string): Promise<boolean> {
    const normalizedReference = storageReference.trim();

    if (!normalizedReference) {
      throw new Error("Storage reference cannot be empty.");
    }

    if (normalizedReference.startsWith("gcs://")) {
      return this.gcsStorage.deleteFile(normalizedReference);
    }

    return this.supabaseStorage.deleteFile(normalizedReference);
  }
}
