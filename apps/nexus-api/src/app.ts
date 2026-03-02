import express, { Express } from "express";
import { initializeApp } from "./presentation";

const app: Express = express();
initializeApp(app);

export default app;
