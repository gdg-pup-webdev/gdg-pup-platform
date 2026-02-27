import { SupabaseStudyJamRepository } from "./infrastructure/SupabaseStudyJamRepository";
import { CreateStudyJam } from "./useCases/CreateStudyJam";
import { GetOneStudyJam } from "./useCases/GetOneStudyJam";
import { ListStudyJams } from "./useCases/ListStudyJams";
import { UpdateStudyJam } from "./useCases/UpdateStudyJam";
import { DeleteStudyJam } from "./useCases/DeleteStudyJam"; 
import { StudyJamController } from "./StudyJamController";

const repository = new SupabaseStudyJamRepository();

export const studyJamController = new StudyJamController(
  new CreateStudyJam(repository),
  new GetOneStudyJam(repository),
  new ListStudyJams(repository),
  new UpdateStudyJam(repository),
  new DeleteStudyJam(repository)
);