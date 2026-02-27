 import { FilesModuleController } from "@/v1/modules/filesModule";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express"; 

export class FilesHttpController {
  constructor(private filesModuleController: FilesModuleController) {}

  listFiles: RequestHandler = createExpressController(
    contract.api.v1.files.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } =
        await this.filesModuleController.listFIlesWithPagination(
          pageNumber,
          pageSize,
        );

      return output(200, {
        status: "success",
        message: "Files fetched successfully",
        data: list.map((f) => {
          return {
            ...f,
            fileName: f.name,
            fileDescription: f.description,
            filePath: f.path,
          };
        }),
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
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

      const result = await this.filesModuleController.uploadFile(
        await file.arrayBuffer(),
        file.type,
        input.body.data.fileName,
        input.body.data.fileDescription,
        input.body.data.filePath,
      );

      return output(200, {
        status: "success",
        message: "File uploaded successfully",
        data: {
          ...result,
          fileName: result.name,
          fileDescription: result.description,
          filePath: result.path,
        },
      });
    },
  );

  deleteFileById: RequestHandler = createExpressController(
    contract.api.v1.files.fileId.DELETE,
    async ({ input, output, ctx }) => {
      const id = input.params.fileId;
      await this.filesModuleController.deleteFileById(id);
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
      const result = await this.filesModuleController.getOneFileById(id);
      return output(200, {
        status: "success",
        message: "File fetched successfully",
        data: {
          ...result,
          fileName: result.name,
          fileDescription: result.description,
          filePath: result.path,
        },
      });
    },
  );

  updateFileById: RequestHandler = createExpressController(
    contract.api.v1.files.fileId.PATCH,
    async ({ input, output, ctx }) => {
      const id = input.params.fileId;
      const updateDTO = input.body.data;
      const result = await this.filesModuleController.updateFileById(
        id,
        updateDTO,
      );
      return output(200, {
        status: "success",
        message: "File updated successfully",
        data: {
          ...result,
          fileName: result.name,
          fileDescription: result.description,
          filePath: result.path,
        },
      });
    },
  );
}
