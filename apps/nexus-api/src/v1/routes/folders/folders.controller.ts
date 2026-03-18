import { FilesModuleController } from "@/v1/modules/filesModule";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express"; 

export class FoldersHttpController {
  constructor(private filesModuleController: FilesModuleController) {}

  // Folder handlers
  listFolders: RequestHandler = createExpressController(
    contract.api.v1.folders.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const parentId = input.query.parentId || null;

      const result = await this.filesModuleController.listFoldersByParent(
        pageNumber,
        pageSize,
        parentId,
      );

      return output(200, {
        status: "success",
        message: "Folders fetched successfully",
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

  createFolder: RequestHandler = createExpressController(
    contract.api.v1.folders.POST,
    async ({ input, output, ctx }) => {
      const result = await this.filesModuleController.createFolder(input.body.data);
      return output(201, {
        status: "success",
        message: "Folder created successfully",
        data: result,
      });
    },
  );

  getOneFolderById: RequestHandler = createExpressController(
    contract.api.v1.folders.folderId.GET,
    async ({ input, output, ctx }) => {
      const id = input.params.folderId;
      const result = await this.filesModuleController.getOneFolderById(id);
      return output(200, {
        status: "success",
        message: "Folder fetched successfully",
        data: result,
      });
    },
  );
}
