import { FileBuffer } from "./FileBuffer";
import { UploadedFileBuffer } from "./UploadedFileBuffer";

export abstract class IFileStorage {
  abstract uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer>;

  abstract deleteFile(storageReference: string): Promise<boolean>;
}
