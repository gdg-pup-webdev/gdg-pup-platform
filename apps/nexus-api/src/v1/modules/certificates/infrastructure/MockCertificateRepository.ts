import { ICertificateRepository } from "../domain/ICertificateRepository";
import { Certificate } from "../domain/Certificate";

export class MockCertificateRepository implements ICertificateRepository {
  public certificates: Certificate[] = [];

  async findById(id: string): Promise<Certificate | null> {
    return this.certificates.find((c) => c.props.id === id) || null;
  }

  async findAll(filters?: { userId?: string }, pageNumber = 1, pageSize = 10): Promise<{ list: Certificate[]; count: number }> {
    let filtered = this.certificates;
    
    if (filters?.userId) {
      filtered = filtered.filter((c) => c.props.userId === filters.userId);
    }

    const from = (pageNumber - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);

    return {
      list: paginated,
      count: filtered.length,
    };
  }

  async saveNew(certificate: Certificate): Promise<Certificate> {
    this.certificates.push(certificate);
    return certificate;
  }

  async persistUpdates(certificate: Certificate): Promise<Certificate> {
    const index = this.certificates.findIndex((c) => c.props.id === certificate.props.id);
    if (index !== -1) {
      this.certificates[index] = certificate;
    }
    return certificate;
  }

  async delete(id: string): Promise<void> {
    this.certificates = this.certificates.filter((c) => c.props.id !== id);
  }
}