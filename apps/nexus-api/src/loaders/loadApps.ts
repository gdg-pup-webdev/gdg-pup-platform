import { deprecatedRouteMiddleware } from "@/middlewares/deprecatedRoute.middleware";
import { Version0 } from "@/v0";
import { Version1 } from "@/v1";
import express, { Express } from "express";

export const loadApps = (app: Express) => {
  const version0 = new Version0();
  const version1 = new Version1();

  app.use("/api/v1", version1.app);

  app.use(deprecatedRouteMiddleware("v1"));

  app.use("/api/v0", version0.app);
  app.use("/api", version0.app);
};
