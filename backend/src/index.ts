import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import tasksRouter from "./routes/tasks";
import columnsRouter from "./routes/columns";
import syncRouter from "./routes/sync";
import boardsRouter from "./routes/boards";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_, res) => {
  res.json({ 
    name: "Offline Kanban Board API",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/tasks",
      "GET /api/columns",
      "GET /api/boards",
      "POST /api/sync"
    ]
  });
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/tasks", tasksRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/sync", syncRouter);
app.use("/api/boards", boardsRouter);

// Error handling (must be last)
app.use(errorHandler);

if (process.env.START_SERVER !== "false") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`===> CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`);
  });
}

export default app;
