import { ITeamResourceStorage, TeamResourceFile, UploadedTeamResourceFile } from "../domain/ITeamResourceStorage";
import { FilesModuleController } from "../../filesModule/FilesModuleController";

/**
 * Adapter that implements the ITeamResourceStorage port using the FilesModuleController.
 */
export class TeamResourceStorageAdapter implements ITeamResourceStorage {
  constructor(private readonly filesController: FilesModuleController) {}

  async uploadFile(file: TeamResourceFile): Promise<UploadedTeamResourceFile> {
    const result = await this.filesController.uploadFile(
      file.buffer,
      file.type,
      file.name,
      `Thumbnail for team resource: ${file.name}`,
      "team-resources/thumbnails"
    );

    return {
      storageReference: result.storageReference,
      publicUrl: result.previewUrl,
    };
  }

  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesController.deleteFileByPreviewUrl(publicUrl);
  }
}
