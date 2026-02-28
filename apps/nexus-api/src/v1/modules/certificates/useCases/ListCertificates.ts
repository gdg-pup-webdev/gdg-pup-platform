import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate } from "../domain/Certificate";

export interface ListCertificatesRequest {
  userId?: string;
  pageNumber: number;
  pageSize: number;
}

export class ListCertificates {
  constructor(private readonly repo: ICertificateRepository) {}

  async execute(req: ListCertificatesRequest): Promise<{ list: Certificate[]; count: number }> {
    return await this.repo.findAll({ userId: req.userId }, req.pageNumber, req.pageSize);
  }
}