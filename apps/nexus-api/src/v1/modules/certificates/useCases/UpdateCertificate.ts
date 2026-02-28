import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate, CertificateUpdateProps } from "../domain/Certificate";

export interface UpdateCertificateRequest {
  id: string;
  data: CertificateUpdateProps;
}

export class UpdateCertificate {
  constructor(private readonly repo: ICertificateRepository) {}

  async execute(req: UpdateCertificateRequest): Promise<Certificate> {
    const certificate = await this.repo.findById(req.id);
    
    if (!certificate) {
      throw new Error(`Cannot update: Certificate with ID ${req.id} not found.`);
    }

    certificate.update(req.data);

    return await this.repo.persistUpdates(certificate);
  }
}