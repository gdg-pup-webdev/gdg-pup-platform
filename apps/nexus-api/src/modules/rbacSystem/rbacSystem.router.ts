import { Router } from "express"


export class RbacSystemRouter {
    constructor () {} 

    getRouter =() : Router => {
        const router=  Router();
        return router;
    }
}



export const rbacSystemRouterInstance = new RbacSystemRouter();