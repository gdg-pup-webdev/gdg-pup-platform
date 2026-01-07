import {
  publicQuestionInsertSchema,
  publicQuestionRowSchema,
  Tables,
  TablesInsert,
} from "@packages/webdev-api-contracts";

export class QuestionModel {
  constructor() {}

  async createQuestion(createDTO: TablesInsert<"question">) {
    const parseResult = publicQuestionInsertSchema.safeParse(createDTO);

    if (!parseResult.success) {
      return { error: parseResult.error };
    }

    const mockResult: Tables<"question"> = {
      answer: 0,
      category: null,
      created_at: "2023-08-25T00:00:00.000Z",
      creator_id: "123123",
      explanation: null,
      id: "123123",
      option_a: "Option A",
      option_b: "Option B",
      option_c: "Option C",
      option_d: "Option D",
      question: "This is a question",
      schedule: "2023-08-25T00:00:00.000Z",
      value: 100,
    } as Tables<"question">;

    return { data: mockResult };
  }
}

export const questionModel = new QuestionModel();
