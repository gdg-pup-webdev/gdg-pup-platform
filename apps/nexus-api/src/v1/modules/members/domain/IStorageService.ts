export class FileToUpload {
  buffer: ArrayBuffer;
  name: string;
  type: string;

  constructor({ buffer, name, type }: { buffer: ArrayBuffer; name: string; type: string }) {
    this.buffer = buffer;
    this.name = name;
    this.type = type;
  }
}

export class UploadedFile {
  storageReference: string;
  publicUrl: string;
  publicUrl64: string;
  publicUrl512: string;

  constructor({
    storageReference,
    publicUrl,
    publicUrl64,
    publicUrl512,
  }: {
    storageReference: string;
    publicUrl: string;
    publicUrl64: string;
    publicUrl512: string;
  }) {
    this.storageReference = storageReference;
    this.publicUrl = publicUrl;
    this.publicUrl64 = publicUrl64;
    this.publicUrl512 = publicUrl512;
  }
}

export abstract class IStorageService {
  abstract uploadFile(file: FileToUpload): Promise<UploadedFile>;
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
