 import { Express, Router } from "express";
import express from "express";
import { tokenParserFromHeaders } from "../middlewares/tokenParser";

export const loadParsers = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // parse query with extended param to parse object queries
    app.set("query parser", "extended");

  // parse authentication token
  app.use(tokenParserFromHeaders);
};
