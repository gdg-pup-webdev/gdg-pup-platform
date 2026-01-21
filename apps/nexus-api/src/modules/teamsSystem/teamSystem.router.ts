import { Router } from "express";




export class TeamSystemRouter { 
    constructor () {}

    getRouter = () : Router => {
        const router = Router();
        return router;
    
    }
}

export const teamSystemRouterInstance = new TeamSystemRouter();