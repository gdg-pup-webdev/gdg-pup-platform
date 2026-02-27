import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate, CertificateInsertProps } from "../domain/Certificate";

export class CreateCertificate {
  constructor(private readonly repo: ICertificateRepository) {}

  async execute(req: CertificateInsertProps): Promise<Certificate> {
    const certificate = Certificate.create(req);
    return await this.repo.saveNew(certificate);
  }
}