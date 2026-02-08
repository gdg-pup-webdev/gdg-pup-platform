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
    return  await this.certificateRepository.listCertificatesOfUser(userId);
  };

  /**
   * listCertificates
   * Retrieves all certificates in the system.
   * @returns {Promise<{list: any[], count: number}>} Paginated result of all certificates.
   */
  listCertificates = async () => { 
    return await this.certificateRepository.listCertificates();
  };

  /**
   * getOneCertificate
   * Fetches detailed information for a single certificate by ID.
   * @param id - The unique ID of the certificate.
   */
  getOneCertificate = async (id: string) => { 
    return  await this.certificateRepository.getOneCertificate(id);
  };

  /**
   * createCertificate
   * Validates and persists a new certificate for a user.
   * @param dto - Data containing title, description, image URL, and user_id.
   */
  createCertificate = async (dto: certificateInsertDTO) => { 
    return  await this.certificateRepository.createCertificate(dto);
  };

  /**
   * deleteCertificate
   * Removes a certificate record from the database.
   * @param id - The ID of the certificate to remove.
   */
  deleteCertificate = async (id: string) => {
     await this.certificateRepository.deleteCertificate(id)
  };

  /**
   * updateCertificate
   * Updates an existing certificate's properties.
   * @param id - The ID of the certificate to update.
   * @param dto - Partial data containing fields to modify.
   */
  updateCertificate = async (id: string, dto: certificateUpdateDTO) => { 
    return await this.certificateRepository.updateCertificate(id, dto);
  };
}

/**
 * Exported singleton instance of the CertificateService.
 */
export const certificateServiceInstance = new CertificateService();
