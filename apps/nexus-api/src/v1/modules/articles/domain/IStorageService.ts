export interface FileToUpload {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

export interface UploadedFile {
  storageReference: string;
  publicUrl: string;
}

export abstract class IStorageService {
  abstract uploadFile(file: FileToUpload): Promise<UploadedFile>;
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
