import { Version0 } from "@/v0";
import express, { Express } from "express";

export const loadApps = (app: Express) => {
  const version0 = new Version0();

  app.use("/", version0.app);
};
