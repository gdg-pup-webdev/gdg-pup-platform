import { SupabaseCertificateRepository } from "./infrastructure/SupabaseCertificateRepository";
import { CreateCertificate } from "./useCases/CreateCertificate";
import { GetOneCertificate } from "./useCases/GetOneCertificate";
import { ListCertificates } from "./useCases/ListCertificates";
import { UpdateCertificate } from "./useCases/UpdateCertificate";
import { DeleteCertificate } from "./useCases/DeleteCertificate"; 
import { CertificateController } from "./CertificateController";

const repository = new SupabaseCertificateRepository();

const createUC = new CreateCertificate(repository);
const getOneUC = new GetOneCertificate(repository);
const listUC = new ListCertificates(repository);
const updateUC = new UpdateCertificate(repository);
const deleteUC = new DeleteCertificate(repository);

export const certificateController = new CertificateController(
  createUC,
  getOneUC,
  listUC,
  updateUC,
  deleteUC
);