export interface TeamResourceFile {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

export interface UploadedTeamResourceFile {
  storageReference: string;
  publicUrl: string;
}

export abstract class ITeamResourceStorage {
  abstract uploadFile(file: TeamResourceFile): Promise<UploadedTeamResourceFile>;
  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
