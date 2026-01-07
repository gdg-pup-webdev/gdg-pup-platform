import { Router } from "express";
import {
  questionSystemController,
  QuestionSystemController,
} from "./questionSystem.controller.js"; 

export class QuestionSystemRouter {
  constructor(
    private controller: QuestionSystemController = questionSystemController, 
  ) {}

  getRouter = () => {
    const router = Router();

    router.post("/questions", this.controller.create); 

    return router;
  };
}

export const questionSystemRouter = new QuestionSystemRouter();
