import express, { Express } from "express";
import { loadApps } from "./loaders/loadApps";
import { loadDocs } from "./loaders/loadDocs";
import { loadCors } from "./loaders/loadCors";
import { loadLogger } from "./loaders/loadLogger";
import { loadRateLimiter } from "./loaders/loadRateLimiter";
import { loadParsers } from "./loaders/loadParsers";
import { assertContractIntegrity } from "./utils/assertContractIntegrity";

const app: Express = express();

// assertContractIntegrity();

loadCors(app);
loadLogger(app);
loadRateLimiter(app);
loadParsers(app);

loadDocs(app);
loadApps(app);

export default app;
