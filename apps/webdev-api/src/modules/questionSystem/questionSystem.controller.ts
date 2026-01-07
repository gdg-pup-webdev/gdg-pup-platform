 
import { RequestHandler } from "express";
import {
  questionService as defaultQuestionService,
  QuestionService,
} from "./question.service.js"; 
import { createExpressController } from "@packages/api-typing";
import { webdevApiContract } from "@packages/webdev-api-contracts";

export class QuestionSystemController {
  constructor(
    private questionService: QuestionService = defaultQuestionService, 
  ) {}

  create: RequestHandler = createExpressController(
    webdevApiContract.questionSystem.questions.post,
    async ({ input, output, res, req }) => {
      const { data, error } = await this.questionService.create({
        ...input.body,
        creator_id: "123123",
      });

      if (error) {
        return output(500, {
          status: "error",
          message: "Failed to create question.",
        });
      }

      return output(201, {
        status: "success",
        message: "hello there!",
        data: data,
      });
    }
  );

}

export const questionSystemController = new QuestionSystemController();
