/**
 * @file certificate.repository.ts
 * @description Data access layer for User Certificates.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { SupabaseWrapper } from "../common/supabase.wrapper.js";

type certificateRow = Tables<"user_certificate">;
type certificateInsert = TablesInsert<"user_certificate">;
type certificateUpdate = TablesUpdate<"user_certificate">;

/**
 * CertificateRepository
 * Manages database persistence for user certificates.
 */
export class CertificateRepository {
  private readonly db = new SupabaseWrapper<
    certificateRow,
    certificateInsert,
    certificateUpdate
  >("user_certificate");

  /**
   * listCertificatesOfUser
   * Retrieves all certificates for a specific user.
   */
  listCertificatesOfUser = (userId: string) => this.db.listByUser(userId);

  /**
   * listCertificates
   * Retrieves all certificates in the system.
   */
  listCertificates = () => this.db.listAll();

  /**
   * getOneCertificate
   * Fetches a single certificate by ID.
   */
  getOneCertificate = (id: string) => this.db.getOne(id);

  /**
   * createCertificate
   * Creates a new certificate record.
   */
  createCertificate = (dto: certificateInsert) => this.db.create(dto);

  /**
   * updateCertificate
   * Updates an existing certificate record.
   */
  updateCertificate = (id: string, dto: certificateUpdate) =>
    this.db.update(id, dto);

  /**
   * deleteCertificate
   * Deletes a certificate record.
   */
  deleteCertificate = (id: string) => this.db.delete(id);
}

export const certificateRepositoryInstance = new CertificateRepository();