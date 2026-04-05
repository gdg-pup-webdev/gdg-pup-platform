import express, { Express } from "express";
import { loadApps } from "./src/loaders/loadApps.js";
import { loadDocs } from "./src/loaders/loadDocs.js";
import { loadCors } from "./src/loaders/loadCors.js";
import { loadLogger } from "./src/loaders/loadLogger.js";
import { loadRateLimiter } from "./src/loaders/loadRateLimiter.js";
import { loadParsers } from "./src/loaders/loadParsers.js";

const app: Express = express();

console.time("loadCors");
loadCors(app);
console.timeEnd("loadCors");

console.time("loadLogger");
loadLogger(app);
console.timeEnd("loadLogger");

console.time("loadRateLimiter");
loadRateLimiter(app);
console.timeEnd("loadRateLimiter");

console.time("loadParsers");
loadParsers(app);
console.timeEnd("loadParsers");

console.time("loadDocs");
loadDocs(app);
console.timeEnd("loadDocs");

console.time("loadApps");
loadApps(app);
console.timeEnd("loadApps");

console.log("Benchmark complete.");
process.exit(0);
