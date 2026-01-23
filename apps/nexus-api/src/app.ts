import express from "express";
import { setupLoader } from "./loaders/setup.loader.js";
import { parsersLoader } from "./loaders/parsers.loader.js";
import { routesLoader } from "./loaders/routes.loader.js";
import { errorHandlerLoader } from "./loaders/errorHandlers.loader.js";
import { swaggerLoader } from "./loaders/swagger.loader.js";

const app = express();

// setup api
setupLoader(app);

// Parsing body
parsersLoader(app);

// setup swagger
swaggerLoader(app);

// load routes
routesLoader(app);

// error handlers
errorHandlerLoader(app);

export default app;
