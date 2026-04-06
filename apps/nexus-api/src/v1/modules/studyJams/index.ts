import { StudyJamController } from "./StudyJamController";
import { MockStudyJamRepository } from "./infrastructure/MockStudyJamRepository";
import { CreateStudyJam } from "./useCases/CreateStudyJam";
import { DeleteStudyJam } from "./useCases/DeleteStudyJam";
import { GetOneStudyJam } from "./useCases/GetOneStudyJam";
import { ListStudyJams } from "./useCases/ListStudyJams";
import { UpdateStudyJam } from "./useCases/UpdateStudyJam";

const studyJamRepository = new MockStudyJamRepository();

const createStudyJam = new CreateStudyJam(studyJamRepository);
const getOneStudyJam = new GetOneStudyJam(studyJamRepository);
const listStudyJams = new ListStudyJams(studyJamRepository);
const updateStudyJam = new UpdateStudyJam(studyJamRepository);
const deleteStudyJam = new DeleteStudyJam(studyJamRepository);

export const studyJamController = new StudyJamController(
  createStudyJam,
  getOneStudyJam,
  listStudyJams,
  updateStudyJam,
  deleteStudyJam,
);

export * from "./StudyJamController";
