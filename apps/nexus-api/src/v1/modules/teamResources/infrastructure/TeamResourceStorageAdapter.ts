import { ITeamResourceStorage, TeamResourceFile, UploadedTeamResourceFile } from "../domain/ITeamResourceStorage";
import { mockFileStorage } from "../../../utils/MockFileStorage";

/**
 * Adapter that implements the ITeamResourceStorage port using the shared mockFileStorage.
 */
export class TeamResourceStorageAdapter implements ITeamResourceStorage {
  async uploadFile(file: TeamResourceFile): Promise<UploadedTeamResourceFile> {
    const result = await mockFileStorage.upload(file);
    return {
      storageReference: result.storageReference,
      publicUrl: result.publicUrl,
    };
  }

  async deleteFile(storageReference: string): Promise<boolean> {
    return await mockFileStorage.delete(storageReference);
  }
}
