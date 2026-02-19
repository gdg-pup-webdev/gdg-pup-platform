import { FileBuffer } from "@/modules/filesSystem/domain/FileBuffer";
import { FileRecord } from "@/modules/filesSystem/domain/FileRecord";

export const convertFileRecordToFileRow = (f: FileRecord) => {
  return {
    ...f.props,
    downloadUrl: f.props.previewUrl,
  };
};

export const convertFileToFileBuffer = async (f: File): Promise<FileBuffer> => {
  return {
    arraybuffer: await f.arrayBuffer(),
    name: f.name,
    type: f.type,
  };
};
