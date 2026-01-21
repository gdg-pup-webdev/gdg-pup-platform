import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller";


export class RoleRouter {
    constructor(
        private roleController: RoleController = roleControllerInstance
    ) {}

    getRouter = (): Router => {
        const router = Router();

        router.get("/", this.roleController.listUserRoles);

        return router;
    };

}



export const roleRouterInstance = new RoleRouter();