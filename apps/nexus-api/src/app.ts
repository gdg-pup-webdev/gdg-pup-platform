import express, { Express } from "express";
import { initializeApp } from "./v0/presentation";

const app: Express = express();
initializeApp(app);

export default app;
