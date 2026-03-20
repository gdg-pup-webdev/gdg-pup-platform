export type FileRecordPrototypeProps = {
  fileName: string;
  fileDescription: string;
  folderId: string | null;
  previewUrl: string;
  storageReference: string;
  fileType: string;
};

export type FileRecordMetadataProps = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type FileRecordUpdateProps = Partial<
  Omit<FileRecordPrototypeProps, "previewUrl" | "storageReference">
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
    return new FileRecord(props);
  }

  update(props: FileRecordUpdateProps) {
    // merge update to avoid nulling out props
    this.props = {
      ...this.props,
      ...props,
    };
  }
}
