import express, { Express } from "express";
import { loadApps } from "./loaders/loadApps";
import { loadDocs } from "./loaders/loadDocs";

const app: Express = express();

loadDocs(app);

loadApps(app);

export default app;
