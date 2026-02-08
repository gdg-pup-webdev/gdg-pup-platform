/**
 * @file certificate.controller.ts
 * @description Controller for managing user certificates. Handles HTTP request parsing,
 * contract validation via typed-rest, and response generation.
 */

import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import {
  CertificateService,
  certificateServiceInstance,
} from "./certificate.service.js";

export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService = certificateServiceInstance,
  ) {}

  /**
   * listUserCertificates
   * GET /api/user-resource-system/certificates
   */
  listUserCertificates: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.GET,
    async ({ input, output }) => {
      // pagination options with safe defaults from query
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const data =
          await this.certificateService.listCertificatesOfUser(userId);

        list = data.list;
        count = data.count;
      } else {
        const data = await this.certificateService.listCertificates();

        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "User certificates fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
          pageSize,
        },
      });
    },
  );

  /**
   * getOneCertificate
   * GET /api/user-resource-system/certificates/:certificateId
   */
  getOneCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.GET,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId;
      const data =
        await this.certificateService.getOneCertificate(certificateId);

      return output(200, {
        status: "success",
        message: "Certificate fetched successfully",
        data,
      });
    },
  );

  /**
   * createCertificate
   * POST /api/user-resource-system/certificates
   */
  createCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.POST,
    async ({ input, output }) => {
      const dto = input.body.data;

      const data = await this.certificateService.createCertificate(dto);

      return output(201, {
        status: "success",
        message: "Certificate created successfully",
        data,
      });
    },
  );

  /**
   * updateCertificate
   * PATCH /api/user-resource-system/certificates/:certificateId
   */
  updateCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.PATCH,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId;
      const dto = input.body.data;

      const data = await this.certificateService.updateCertificate(
        certificateId,
        dto,
      );

      return output(200, {
        status: "success",
        message: "Certificate updated successfully",
        data,
      });
    },
  );

  /**
   * deleteCertificate
   * DELETE /api/user-resource-system/certificates/:certificateId
   */
  deleteCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.DELETE,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId;
      await this.certificateService.deleteCertificate(certificateId);

      return output(200, {
        status: "success",
        message: "Certificate deleted successfully",
      });
    },
  );
}

export const certificateControllerInstance = new CertificateController();
