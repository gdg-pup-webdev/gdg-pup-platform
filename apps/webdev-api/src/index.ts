import express from "express";
import { questionSystemRouter } from "./modules/questionSystem/questionSystem.route.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

// CORS config
app.use(
  cors({
    origin: [
      process.env.DEV_MODE === "true" && "http://localhost:3000",
      process.env.CLIENT_URL!,
    ],
    credentials: true,
  })
);

// Cors config
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   })
// );

app.use(loggerMiddleware.pino);

// Rate limiting
app.use(rateLimiter);

// Parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");

// Routes
app.use("/api/question-system", questionSystemRouter.getRouter());

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
