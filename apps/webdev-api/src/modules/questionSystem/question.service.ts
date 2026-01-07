import { questionModel, QuestionModel } from "./question.model.js"; 
import { TablesInsert } from "@packages/webdev-api-contracts";

export class QuestionService {
  constructor(private questionModel: QuestionModel) {
    this.questionModel = questionModel;
  }

  /**
   * =================================
   * CREATE
   * =================================
   */
  create = async (dto: TablesInsert<"question">)   => {
    const { data, error } = await this.questionModel.createQuestion(dto);

    if (error) {
      return { error };
    }

    return { data };
  }; 
}

export const questionService = new QuestionService(questionModel);
