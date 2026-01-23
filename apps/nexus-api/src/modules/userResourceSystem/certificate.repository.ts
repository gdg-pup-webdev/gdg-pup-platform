/**
 * @file certificate.repository.ts
 * @description Data access layer for User Certificates. 
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { BaseRepository } from "../common/base.repository.js";

type certificateRow = Tables<"user_certificate">;
type certificateInsert = TablesInsert<"user_certificate">;
type certificateUpdate = TablesUpdate<"user_certificate">;

export class CertificateRepository extends BaseRepository<
  certificateRow,
  certificateInsert,
  certificateUpdate
> {
  constructor() {
    super("user_certificate");
  }

  listCertificatesOfUser = this.listByUser;
  listCertificates = this.listAll;
  getOneCertificate = this.getOne;
  createCertificate = this.create;
  updateCertificate = this.update;
  deleteCertificate = this.delete;
}

export const certificateRepositoryInstance = new CertificateRepository();
