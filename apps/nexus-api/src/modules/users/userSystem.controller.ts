import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";

export class UserSystemController {
  constructor(private userService: UserService = userServiceInstance) {}

  getUserById: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } = await this.userService.getUserById(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };
}

export const userSystemControllerInstance = new UserSystemController();
