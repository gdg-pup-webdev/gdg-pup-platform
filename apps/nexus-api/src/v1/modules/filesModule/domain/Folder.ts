export type FolderProps = {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FolderInsertProps = {
  name: string;
  description?: string;
  parentId: string | null;
};

export type FolderUpdateProps = Partial<FolderInsertProps>;

export class Folder {
  private constructor(public props: FolderProps) {}

  static create(props: FolderInsertProps, id: string): Folder {
    const now = new Date().toISOString();
    return new Folder({
      ...props,
      id,
      createdAt: now,
      updatedAt: now,
    });
  }

  static hydrate(props: FolderProps): Folder {
    return new Folder(props);
  }

  update(props: FolderUpdateProps): void {
    this.props = {
      ...this.props,
      ...props,
      updatedAt: new Date().toISOString(),
    };
  }
}
