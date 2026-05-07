import { Express, Router } from "express";
import express from "express";
import cookieParser from "cookie-parser";

export const loadParsers = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // parse query with extended param to parse object queries
  app.set("query parser", "extended");
};
