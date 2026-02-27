import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate } from "../domain/Certificate";

export class GetOneCertificate {
  constructor(private readonly repo: ICertificateRepository) {}

  async execute(id: string): Promise<Certificate> {
    const certificate = await this.repo.findById(id);
    if (!certificate) {
      throw new Error(`Certificate with ID ${id} not found.`);
    }
    return certificate;
  }
}
