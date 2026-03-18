import { fileRecord, fileRecordInsertDTO, fileRecordUpdateDTO } from "@packages/nexus-api-contracts";
import { z } from "zod";

export type FileRecord = z.infer<typeof fileRecord>;
export type FileRecordInsert = z.infer<typeof fileRecordInsertDTO>;
export type FileRecordUpdate = z.infer<typeof fileRecordUpdateDTO>;
