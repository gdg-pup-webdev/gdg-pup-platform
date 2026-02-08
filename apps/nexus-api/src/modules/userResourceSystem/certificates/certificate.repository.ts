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
import { DatabaseError } from "@/classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util";
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
    const { data, error } = await tryCatch(
      async () =>
        await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
          user_id: userId,
        }),
      "Calling database to list certificates of user",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * listCertificates
   * Retrieves all certificates in the system.
   */
  listCertificates = async (): RepositoryResultList<certificateRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.listRows(this.tableName, 1, 1000),
      "Calling database to list certificates",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * getOneCertificate
   * Fetches a single certificate by ID.
   */
  getOneCertificate = async (
    id: string,
  ): RepositoryResult<certificateRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.getOneRow(this.tableName, id),
      "Calling database to get one certificate",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * createCertificate
   * Creates a new certificate record.
   */
  createCertificate = async (
    dto: certificateInsert,
  ): RepositoryResult<certificateRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.createRow(this.tableName, dto),
      "Calling database to create certificate",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * updateCertificate
   * Updates an existing certificate record.
   */
  updateCertificate = async (
    id: string,
    dto: certificateUpdate,
  ): RepositoryResult<certificateRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.updateRow(this.tableName, id, dto),
      "Calling database to update certificate",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * deleteCertificate
   * Deletes an certificate record.
   */
  deleteCertificate = async (id: string): RepositoryResult<certificateRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.deleteRow(this.tableName, id),
      "Calling database to delete certificate",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const certificateRepositoryInstance = new CertificateRepository();
