import { fileSystemController } from "@/modules/filesSystem";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";
import {
  convertFileRecordToFileRow,
  convertFileToFileBuffer,
} from "./fileSystem.utils";

export class FileSystemController {
  constructor() {}

  listFiles: RequestHandler = createExpressController(
    contract.api.v1.files.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const result = await fileSystemController.listFIlesWithPagination(
        pageNumber,
        pageSize,
        (f) => {
          return {
            list: f.list.map(convertFileRecordToFileRow),
            count: f.count,
          };
        },
      );

      return output(200, {
        status: "success",
        message: "Files fetched successfully",
        data: result.list,
        meta: {
          totalRecords: result.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(result.count / pageSize),
        },
      });
    },
  );

  uploadFile: RequestHandler = createExpressController(
    contract.api.v1.files.POST,
    async ({ input, output, ctx }) => {
      const file = input.files.file;

      if (!file) {
        return output(400, {
          status: "error",
          message: "File is required",
        });
      }

      const result = await fileSystemController.uploadFile(
        await convertFileToFileBuffer(file),
        input.body.data.fileName,
        input.body.data.fileDescription,
        input.body.data.filePath,
        (f) => convertFileRecordToFileRow(f),
      );

      return output(200, {
        status: "success",
        message: "File uploaded successfully",
        data: result,
      });
    },
  );

  deleteFileById: RequestHandler = createExpressController(
    contract.api.v1.files.fileId.DELETE,
    async ({ input, output, ctx }) => {
      const id = input.params.fileId;
      await fileSystemController.deleteFileById(id, (f) => f);
      return output(200, {
        status: "success",
        message: "File deleted successfully",
      });
    },
  );

  getOneFileById: RequestHandler = createExpressController(
    contract.api.v1.files.fileId.GET,
    async ({ input, output, ctx }) => {
      const id = input.params.fileId;
      console.log("id", id);
      const result = await fileSystemController.getOneFileById(
        id,
        convertFileRecordToFileRow,
      );
      return output(200, {
        status: "success",
        message: "File fetched successfully",
        data: result,
      });
    },
  );

  updateFileById: RequestHandler = createExpressController(
    contract.api.v1.files.fileId.PATCH,
    async ({ input, output, ctx }) => {
      const id = input.params.fileId;
      const updateDTO = input.body.data;
      const result = await fileSystemController.updateFileById(
        id,
        updateDTO,
        convertFileRecordToFileRow,
      );
      return output(200, {
        status: "success",
        message: "File updated successfully",
        data: result,
      });
    },
  );
}
