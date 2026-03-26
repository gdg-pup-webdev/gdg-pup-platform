import { SupabaseLearningResourceRepository } from "./infrastructure/SupabaseLearningResourceRepository";
import { CreateLearningResource } from "./useCases/CreateLearningResource";
import { GetOneLearningResource } from "./useCases/GetOneLearningResource";
import { ListLearningResources } from "./useCases/ListLearningResources";
import { UpdateLearningResource } from "./useCases/UpdateLearningResource";
import { DeleteLearningResource } from "./useCases/DeleteLearningResource"; 
import { LearningResourceController } from "./LearningResourceController";

const repository = new SupabaseLearningResourceRepository();

const createUC = new CreateLearningResource(repository);
const getOneUC = new GetOneLearningResource(repository);
const listUC = new ListLearningResources(repository);
const updateUC = new UpdateLearningResource(repository);
const deleteUC = new DeleteLearningResource(repository);

export const learningResourceController = new LearningResourceController(
  createUC,
  getOneUC,
  listUC,
  updateUC,
  deleteUC,
);
