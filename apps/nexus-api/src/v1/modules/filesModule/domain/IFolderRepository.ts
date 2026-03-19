import { Folder } from "./Folder";

export abstract class IFolderRepository {
  constructor() {}

  abstract save(folder: Folder): Promise<Folder>;

  abstract findById(id: string): Promise<Folder | null>;

  abstract findByNameAndParent(
    name: string,
    parentId: string | null,
  ): Promise<Folder | null>;

  abstract listByParentPaginated(
    page: number,
    pageSize: number,
    parentId: string | null,
  ): Promise<{
    list: Folder[];
    count: number;
  }>;

  abstract deleteById(id: string): Promise<boolean>;
}
