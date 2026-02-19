import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";

export class GCPFileStorage implements IFileStorage {
  uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    throw new Error("Method not implemented.");
  }
  deleteFile(storageReference: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
