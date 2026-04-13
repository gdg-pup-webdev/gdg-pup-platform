export type FileRecordPrototypeProps = {
  fileName: string;
  fileDescription: string;
  folderId: string | null;
  previewUrl: string;
  previewUrl64: string;
  previewUrl128: string;
  previewUrl256: string;
  previewUrl512: string;
  storageReference: string;
  storageRef64: string;
  storageRef128: string;
  storageRef256: string;
  storageRef512: string;
  fileType: string;
};

export type FileRecordMetadataProps = {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
};

export type FileRecordUpdateProps = Partial<
  Omit<
    FileRecordPrototypeProps,
    | "previewUrl"
    | "previewUrl64"
    | "previewUrl128"
    | "previewUrl256"
    | "previewUrl512"
    | "storageReference"
    | "storageRef64"
    | "storageRef128"
    | "storageRef256"
    | "storageRef512"
  >
>;

export class FileRecordPrototype {
  constructor(public props: FileRecordPrototypeProps) {}
}

/**
 *
 */
export class FileRecord {
  private constructor(
    public props: FileRecordPrototypeProps & FileRecordMetadataProps,
  ) {}

  static hydrate(props: FileRecordPrototypeProps & FileRecordMetadataProps) {
    if (props.isDeleted) {
      throw new Error("Cannot hydrate a deleted file record");
    }
    return new FileRecord(props);
  }

  markAsDeleted() {
    if (this.props.isDeleted) {
      return;
    }

    const now = new Date().toISOString();
    this.props = {
      ...this.props,
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    };
  }

  update(props: FileRecordUpdateProps) {
    // merge update to avoid nulling out props
    this.props = {
      ...this.props,
      ...props,
    };
  }
}
