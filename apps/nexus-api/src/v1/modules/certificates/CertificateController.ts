 
import { Certificate } from "./domain/Certificate";
import { CreateCertificate } from "./useCases/CreateCertificate";
import { DeleteCertificate } from "./useCases/DeleteCertificate";
import { GetOneCertificate } from "./useCases/GetOneCertificate";
import { ListCertificates } from "./useCases/ListCertificates";
import { UpdateCertificate } from "./useCases/UpdateCertificate";

 

export interface CertificateResponseDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  issuedAt: string;
}

export class CertificateController {
  constructor(
    private readonly createUseCase: CreateCertificate,
    private readonly getOneUseCase: GetOneCertificate,
    private readonly listUseCase: ListCertificates,
    private readonly updateUseCase: UpdateCertificate,
    private readonly deleteUseCase: DeleteCertificate
  ) {}

  private toDTO(certificate: Certificate): CertificateResponseDTO {
    const p = certificate.props;
    return {
      id: p.id,
      userId: p.userId,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      issuedAt: p.issuedAt.toISOString(),
    };
  }

  async list(pageNumber: number, pageSize: number, userId?: string) {
    const { list, count } = await this.listUseCase.execute({ userId, pageNumber, pageSize });
    return {
      list: list.map((c) => this.toDTO(c)),
      count,
    };
  }

  async getOne(id: string) {
    const certificate = await this.getOneUseCase.execute(id);
    return this.toDTO(certificate);
  }

  async create(data: { userId: string; title: string; description: string; imageUrl?: string }) {
    const certificate = await this.createUseCase.execute(data);
    return this.toDTO(certificate);
  }

  async update(id: string, data: { title?: string; description?: string; imageUrl?: string }) {
    const certificate = await this.updateUseCase.execute({ id, data });
    return this.toDTO(certificate);
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}