import {
  tokenParser,
  tokenParserFromHeaders,
} from "@/middlewares/tokenParser.js";
import { Express } from "express";
import express from "express";
export const parsersLoader = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set("query parser", "extended");

  // app.use(tokenParser);
  app.use(tokenParserFromHeaders);
};
