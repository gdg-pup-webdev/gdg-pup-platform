/**
 * @file certificate.repository.ts
 * @description Data access layer for User Certificates.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { SupabaseUtils } from "@/utils/supabase.util";

/**
 * Database types
 */
type certificateRow = Tables<"user_certificate">;
type certificateInsert = TablesInsert<"user_certificate">;
type certificateUpdate = TablesUpdate<"user_certificate">;

/**
 * CertificateRepository
 * Manages database persistence for certificates earned by users.
 */
export class CertificateRepository {
  tableName = "user_certificate";

  /**
   * listCertificatesOfUser
   * Retrieves all certificates for a specific user.
   */
  listCertificatesOfUser = async (
    userId: string,
  ): RepositoryResultList<certificateRow> => {
    return await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
      user_id: userId,
    });
  };

  /**
   * listCertificates
   * Retrieves all certificates in the system.
   */
  listCertificates = async (): RepositoryResultList<certificateRow> => {
    return await SupabaseUtils.listRows(this.tableName, 1, 1000);
  };

  /**
   * getOneCertificate
   * Fetches a single certificate by ID.
   */
  getOneCertificate = async (id: string): RepositoryResult<certificateRow> => {
    return await SupabaseUtils.getOneRow(this.tableName, id);
  };

  /**
   * createCertificate
   * Creates a new certificate record.
   */
  createCertificate = async (
    dto: certificateInsert,
  ): RepositoryResult<certificateRow> => {
    return await SupabaseUtils.createRow(this.tableName, dto);
  };

  /**
   * updateCertificate
   * Updates an existing certificate record.
   */
  updateCertificate = async (
    id: string,
    dto: certificateUpdate,
  ): RepositoryResult<certificateRow> => {
    return await SupabaseUtils.updateRow(this.tableName, id, dto);
  };

  /**
   * deleteCertificate
   * Deletes an certificate record.
   */
  deleteCertificate = async (id: string): RepositoryResult<certificateRow> => {
    return await SupabaseUtils.deleteRow(this.tableName, id);
  };
}

export const certificateRepositoryInstance = new CertificateRepository();
