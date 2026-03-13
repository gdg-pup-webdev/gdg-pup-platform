import { Express, Router } from "express";
import express from "express";

export const loadParsers = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // parse query with extended param to parse object queries
  app.set("query parser", "extended");
};
