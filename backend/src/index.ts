import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import tasksRouter from './routes/tasks';
import boardsRouter from './routes/boards';
import authRouter from './routes/auth';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Middleware
    app.use(helmet());
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get('/api/health', (_, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/tasks', tasksRouter);
    app.use('/api/boards', boardsRouter);

    // Error handling (must be last)
    app.use(errorHandler);

    if (process.env.START_SERVER !== 'false') {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
