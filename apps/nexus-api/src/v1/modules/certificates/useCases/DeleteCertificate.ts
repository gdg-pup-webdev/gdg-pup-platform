import { ICertificateRepository } from "../domain/ICertificateRepository";

export class DeleteCertificate {
  constructor(private readonly repo: ICertificateRepository) {}

  async execute(id: string): Promise<boolean> {
    const certificate = await this.repo.findById(id);
    
    if (!certificate) {
      throw new Error(`Cannot delete: Certificate with ID ${id} not found.`);
    }

    await this.repo.delete(id);
    return true;
  }
}