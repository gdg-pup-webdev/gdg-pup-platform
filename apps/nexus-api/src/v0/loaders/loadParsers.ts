 import { Express, Router } from "express";
import express from "express";
import { tokenParserFromHeaders } from "../middlewares/tokenParser";

export const loadParsers = (router: Router) => {
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  // parse query with extended param to parse object queries
  //   router.set("query parser", "extended");

  // parse authentication token
  router.use(tokenParserFromHeaders);
};
