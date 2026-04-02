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

  constructor({ storageReference, publicUrl }: { storageReference: string; publicUrl: string }) {
    this.storageReference = storageReference;
    this.publicUrl = publicUrl;
  }

}



export abstract class IFileStorage {
  abstract uploadFile(file: FileToUpload): Promise<UploadedFile>;
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
