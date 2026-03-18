import { fileRecord, fileRecordInsertDTO, fileRecordUpdateDTO, folder, folderInsertDTO, folderUpdateDTO } from "@packages/nexus-api-contracts";
import { z } from "zod";

export type FileRecord = z.infer<typeof fileRecord>;
export type FileRecordInsert = z.infer<typeof fileRecordInsertDTO>;
export type FileRecordUpdate = z.infer<typeof fileRecordUpdateDTO>;

export type Folder = z.infer<typeof folder>;
export type FolderInsert = z.infer<typeof folderInsertDTO>;
export type FolderUpdate = z.infer<typeof folderUpdateDTO>;
