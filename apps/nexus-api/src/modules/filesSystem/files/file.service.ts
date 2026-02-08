import {
  NotFoundError} from "@/errors/HttpError.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { FileRepository, fileRepositoryInstance } from "./file.repository.js";

export type FileRecord = {
  id: string;
  user_id?: string | null;
  name?: string | null;
};

type ListParams = {
  pageNumber?: number;
  pageSize?: number;
};

export class FileService {
  constructor(private repository: FileRepository = fileRepositoryInstance) {}

  async create(dto: Record<string, unknown>, userId?: string) {
    try {
      return await this.repository.create({
        ...dto,
        user_id: userId ?? null,
      });
    } catch (error) {
      throw new RepositoryError_DEPRECATED((error as Error).message);
    }
  }

  async list({ pageNumber = 1, pageSize = 10 }: ListParams) {
    try {
      return await this.repository.list({ pageNumber, pageSize });
    } catch (error) {
      throw new RepositoryError_DEPRECATED((error as Error).message);
    }
  }

  async getOne(fileId: string) {
    try {
      const file = await this.repository.getOne(fileId);
      if (!file) {
        throw new NotFoundError("File not found");
      }
      return file;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError_DEPRECATED((error as Error).message);
    }
  }

  async update(fileId: string, dto: Record<string, unknown>) {
    try {
      const updated = await this.repository.update(fileId, dto);
      if (!updated) {
        throw new NotFoundError("File not found");
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError_DEPRECATED((error as Error).message);
    }
  }

  async delete(fileId: string) {
    try {
      const deleted = await this.repository.delete(fileId);
      if (!deleted) {
        throw new NotFoundError("File not found");
      }
      return deleted;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new RepositoryError_DEPRECATED((error as Error).message);
    }
  }
}

export const fileServiceInstance = new FileService();
