export interface EventHighlightFile {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

export interface UploadedEventHighlightFile {
  storageReference: string;
  publicUrl: string;
}

export abstract class IEventHighlightStorage {
  abstract uploadFile(file: EventHighlightFile): Promise<UploadedEventHighlightFile>;
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
