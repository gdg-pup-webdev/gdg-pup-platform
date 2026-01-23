import {
  CertificateRepository,
  certificateRepositoryInstance,
} from "./certificate.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type certificateInsertDTO = models.userResourceSystem.certificate.insertDTO;
type certificateUpdateDTO = models.userResourceSystem.certificate.updateDTO;

export class CertificateService {
  constructor(
    private certificateRepository: CertificateRepository = certificateRepositoryInstance,
  ) {}

  listCertificatesOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.certificateRepository.listCertificatesOfUser(userId),
      "listing certificates",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listCertificates = async () => {
    const { data, error } = await tryCatch(
      async () => await this.certificateRepository.listCertificates(),
      "listing certificates",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  getOneCertificate = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.certificateRepository.getOneCertificate(id),
      "getting certificate",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createCertificate = async (dto: certificateInsertDTO, userId: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.certificateRepository.createCertificate({
          ...dto,
          user_id: userId,
        }),
      "creating certificate",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteCertificate = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.certificateRepository.deleteCertificate(id),
      "deleting certificate",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  updateCertificate = async (id: string, dto: certificateUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.certificateRepository.updateCertificate(id, dto),
      "updating certificate",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const certificateServiceInstance = new CertificateService();
