 
import { Express } from "express";
import express from "express";
import { tokenParserFromHeaders } from "../middlewares/tokenParser";

export const parsersLoader = (app: Express) => {
  // parse body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // parse query with extended param to parse object queries
  app.set("query parser", "extended");

  // parse authentication token
  app.use(tokenParserFromHeaders);
};
