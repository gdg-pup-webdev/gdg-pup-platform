import { randomUUID } from "node:crypto";
import { Folder, FolderInsertProps } from "../domain/Folder";
import { IFolderRepository } from "../domain/IFolderRepository";

export class CreateFolder {
  constructor(private folderRepository: IFolderRepository) {}

  async execute(props: FolderInsertProps): Promise<Folder> {
    const id = randomUUID();
    const folder = Folder.create(props, id);
    const result = await this.folderRepository.save(folder);
    return result;
  }
}
