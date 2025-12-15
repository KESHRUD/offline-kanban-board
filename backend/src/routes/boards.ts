import { Router, Request, Response } from 'express';
import { Board } from '../models';

const router = Router();

// GET /api/boards - Get all boards
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json({ data: boards });
  } catch {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// GET /api/boards/:id - Get board by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    
    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }
    
    res.json({ data: board });
  } catch {
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// POST /api/boards - Create new board
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    const newBoard = await Board.create({
      name,
      description,
    });
    
    res.status(201).json({ data: newBoard });
  } catch {
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// PUT /api/boards/:id - Update board
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, columns } = req.body;
    
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { name, description, columns },
      { new: true, runValidators: true }
    );
    
    if (!updatedBoard) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }
    
    res.json({ data: updatedBoard });
  } catch {
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// DELETE /api/boards/:id - Delete board
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBoard = await Board.findByIdAndDelete(req.params.id);
    
    if (!deletedBoard) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }
    
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

export default router;
