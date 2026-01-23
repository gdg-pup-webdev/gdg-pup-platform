import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { CertificateService, certificateServiceInstance } from "./certificate.service.js";

export class CertificateController {
  constructor(
    private certificateService: CertificateService = certificateServiceInstance,
  ) {}

  listUserCertificates: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.GET,
    async ({ input, output }) => {
      // pagination options
      const pageNumber = input.query.page.number;
      const pageSize = input.query.page.size;

      // getting filters
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.certificateService.listCertificatesOfUser(userId),
          "getting user certificates",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.certificateService.listCertificates(),
          "getting all certificates",
        );

        if (error) throw new ServiceError(error.message);

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

  getOneCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.GET,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId;
      const { data, error } = await tryCatch(
        async () => await this.certificateService.getOneCertificate(certificateId),
        "fetching certificate",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Certificate fetched successfully",
        data,
      });
    },
  );

  createCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const userId = req.user!.id; // user id from token parser

      const dto = input.body.data;
      const { data, error } = await tryCatch(
        async () => await this.certificateService.createCertificate(dto, userId),
        "creating certificate",
      );
      if (error) throw new ServiceError(error.message);

      return output(201, {
        status: "success",
        message: "Certificate created successfully",
        data,
      });
    },
  );

  updateCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.PATCH,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId as string;
      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.certificateService.updateCertificate(certificateId, dto),
        "updating certificate",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Certificate updated successfully",
        data,
      });
    },
  );

  deleteCertificate: RequestHandler = createExpressController(
    contract.api.user_resource_system.certificates.certificateId.DELETE,
    async ({ input, output }) => {
      const certificateId = input.params.certificateId;
      const { data, error } = await tryCatch(
        async () => await this.certificateService.deleteCertificate(certificateId),
        "deleting certificate",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Certificate deleted successfully",
      });
    },
  );
}

export const certificateControllerInstance = new CertificateController();