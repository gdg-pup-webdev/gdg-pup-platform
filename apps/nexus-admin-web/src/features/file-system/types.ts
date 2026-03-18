import { contract, models } from "@packages/nexus-api-contracts";
import { z } from "zod";

const fileRecord = models.v1.fileSystem.file.fileRecord;
const fileRecordInsertDTO = models.v1.fileSystem.file.fileRecordInsertDTO;
const fileRecordUpdateDTO = models.v1.fileSystem.file.fileRecordUpdateDTO;

const folder = models.v1.fileSystem.folder.folder;
const folderInsertDTO = models.v1.fileSystem.folder.folderInsertDTO;
const folderUpdateDTO = models.v1.fileSystem.folder.folderUpdateDTO;

export type FileRecord = z.infer<typeof fileRecord>;
export type FileRecordInsert = z.infer<typeof fileRecordInsertDTO>;
export type FileRecordUpdate = z.infer<typeof fileRecordUpdateDTO>;

export type Folder = z.infer<typeof folder>;
export type FolderInsert = z.infer<typeof folderInsertDTO>;
export type FolderUpdate = z.infer<typeof folderUpdateDTO>;
