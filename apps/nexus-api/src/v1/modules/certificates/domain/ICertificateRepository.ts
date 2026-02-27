import { Certificate } from "./Certificate";

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>;
  findAll(filters?: { userId?: string }, pageNumber?: number, pageSize?: number): Promise<{ list: Certificate[]; count: number }>;
  saveNew(certificate: Certificate): Promise<Certificate>;
  persistUpdates(certificate: Certificate): Promise<Certificate>;
  delete(id: string): Promise<void>;
}