import { RequestHandler } from "express";
import { FileService, fileServiceInstance } from "./file.service.js";

type PaginationQuery = {
  pageNumber?: number;
  pageSize?: number;
};

export class FileController {
  constructor(private readonly fileService: FileService = fileServiceInstance) {}

  listFiles: RequestHandler = async (req, res) => {
    const { pageNumber = 1, pageSize = 10 } = req.query as PaginationQuery;
    const { list, count } = await this.fileService.list({
      pageNumber,
      pageSize,
    });

    res.status(200).json({
      status: "success",
      message: "Files fetched successfully",
      data: list,
      meta: {
        totalRecords: count,
        currentPage: pageNumber,
        pageSize,
        totalPages: Math.max(1, Math.ceil(count / pageSize)),
      },
    });
  };

  createFile: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    const dto = req.body?.data ?? {};
    const created = await this.fileService.create(dto, userId);

    res.status(200).json({
      status: "success",
      message: "File created successfully",
      data: created,
    });
  };

  getFile: RequestHandler = async (req, res) => {
    const { fileId } = req.params;
    const file = await this.fileService.getOne(fileId);

    res.status(200).json({
      status: "success",
      message: "File fetched successfully",
      data: file,
    });
  };

  updateFile: RequestHandler = async (req, res) => {
    const { fileId } = req.params;
    const dto = req.body?.data ?? {};
    const updated = await this.fileService.update(fileId, dto);

    res.status(200).json({
      status: "success",
      message: "File updated successfully",
      data: updated,
    });
  };

  deleteFile: RequestHandler = async (req, res) => {
    const { fileId } = req.params;
    const deleted = await this.fileService.delete(fileId);

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
      data: deleted,
    });
  };
}

export const fileControllerInstance = new FileController();
