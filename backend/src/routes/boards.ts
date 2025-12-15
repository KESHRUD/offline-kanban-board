import { Router, Request, Response } from 'express';
import { Board } from '../types';
import { authMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Apply auth middleware to all board routes
router.use(authMiddleware);

// In-memory storage
const boards: Board[] = [
  {
    id: '1',
    name: 'My Kanban Board',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/boards - Get all boards
router.get('/', (_req: Request, res: Response) => {
  res.json({ data: boards });
});

// POST /api/boards - Create new board
router.post('/', (req: Request, res: Response): void => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const newBoard: Board = {
    id: uuidv4(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  boards.push(newBoard);

  res.status(201).json({ data: newBoard });
});

export default router;
