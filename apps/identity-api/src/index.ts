import express from "express";
import { setupLoader } from "./loaders/setup.loader.js";
import { parsersLoader } from "./loaders/parse.loader.js";
import { routesLoader } from "./loaders/routes.loader.js";
import { errorHandlerLoader } from "./loaders/errorHandlers.loader.js";
import { configs } from "./configs/configs.js";

const app = express();
const port = configs.port;

// setup api
setupLoader(app);

// Parsing body
parsersLoader(app);

// load routes
routesLoader(app);

// error handlers
errorHandlerLoader(app);

// listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
