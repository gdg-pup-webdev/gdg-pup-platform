import { Folder } from "../domain/Folder";
import { IFolderRepository } from "../domain/IFolderRepository";

export class GetOneFolderById {
  constructor(private folderRepository: IFolderRepository) {}

  async execute(id: string): Promise<Folder> {
    const result = await this.folderRepository.findById(id);
    if (!result) throw new Error("Folder not found");
    return result;
  }
}
