import express, { Express, Router } from "express";
import { tokenParserFromHeaders } from "../middlewares/tokenParser";

export const loadParsers = (app: Express) => {
  // parse authentication token
  app.use(tokenParserFromHeaders);
};
