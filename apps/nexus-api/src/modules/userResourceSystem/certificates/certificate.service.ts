/**
 * @file certificate.service.ts
 * @description Service layer for managing user certificates.
 * This class handles the business logic, data orchestration, and error mapping 
 * for certificate-related operations, serving as the bridge between controllers 
 * and the database repository.
 */

import {
  CertificateRepository,
  certificateRepositoryInstance,
} from "./certificate.repository.js";
import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type certificateInsertDTO = models.userResourceSystem.certificate.insertDTO;
type certificateUpdateDTO = models.userResourceSystem.certificate.updateDTO;

/**
 * CertificateService
 * Encapsulates all business operations for User Certificates.
 */
export class CertificateService {
  /**
   * @param certificateRepository - Data access layer for certificates.
   */
  constructor(
    private readonly certificateRepository: CertificateRepository = certificateRepositoryInstance,
  ) {}

  /**
   * listCertificatesOfUser
   * Retrieves a list of certificates belonging to a specific user.
   * @param userId - The unique identifier of the user.
   * @returns {Promise<{list: any[], count: number}>} Paginated result of certificates.
   */
  listCertificatesOfUser = async (userId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.certificateRepository.listCertificatesOfUser(userId),
      "listing certificates",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * listCertificates
   * Retrieves all certificates in the system.
   * @returns {Promise<{list: any[], count: number}>} Paginated result of all certificates.
   */
  listCertificates = async () => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.certificateRepository.listCertificates(),
      "listing certificates",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * getOneCertificate
   * Fetches detailed information for a single certificate by ID.
   * @param id - The unique ID of the certificate.
   */
  getOneCertificate = async (id: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.certificateRepository.getOneCertificate(id),
      "getting certificate",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * createCertificate
   * Validates and persists a new certificate for a user.
   * @param dto - Data containing title, description, image URL, and user_id.
   */
  createCertificate = async (dto: certificateInsertDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.certificateRepository.createCertificate(dto),
      "creating certificate",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  /**
   * deleteCertificate
   * Removes a certificate record from the database.
   * @param id - The ID of the certificate to remove.
   */
  deleteCertificate = async (id: string) => {
    const { error } = await tryCatch_deprecated(
      async () => await this.certificateRepository.deleteCertificate(id),
      "deleting certificate",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);
  };

  /**
   * updateCertificate
   * Updates an existing certificate's properties.
   * @param id - The ID of the certificate to update.
   * @param dto - Partial data containing fields to modify.
   */
  updateCertificate = async (id: string, dto: certificateUpdateDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.certificateRepository.updateCertificate(id, dto),
      "updating certificate",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };
}

/**
 * Exported singleton instance of the CertificateService.
 */
export const certificateServiceInstance = new CertificateService();
