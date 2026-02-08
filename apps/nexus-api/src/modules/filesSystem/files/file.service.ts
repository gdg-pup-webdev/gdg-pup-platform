import { NotFoundError } from "@/errors/HttpError.js";
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
    return await this.repository.create({
      ...dto,
      user_id: userId ?? null,
    });
  }

  async list({ pageNumber = 1, pageSize = 10 }: ListParams) {
    return await this.repository.list({ pageNumber, pageSize });
  }

  async getOne(fileId: string) {
    return await this.repository.getOne(fileId);
  }

  async update(fileId: string, dto: Record<string, unknown>) {
    return await this.repository.update(fileId, dto);
  }

  async delete(fileId: string) {
    return await this.repository.delete(fileId);
  }
}

export const fileServiceInstance = new FileService();
