import { Express } from "express";
import express from "express";
import { tokenParserFromHeaders } from "@/middlewares/tokenParser.js";

export const parsersLoader = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set("query parser", "extended");
  
  // Parse tokens from headers
  app.use(tokenParserFromHeaders);
};
