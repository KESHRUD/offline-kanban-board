import { Router, Request, Response } from 'express';
import { CreateTaskDTO, UpdateTaskDTO } from '../types';
import { Task } from '../models';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// GET /api/tasks - Get all tasks for current user
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ createdBy: req.user?.userId })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');
    res.json({ data: tasks });
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user?.userId, // Only get user's own tasks
    }).populate('assignedTo', 'name email');
    
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.json({ data: task });
  } catch {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: CreateTaskDTO = req.body;
    
    if (!dto.title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    
    const newTask = await Task.create({
      title: dto.title,
      description: dto.description,
      status: dto.status || 'todo',
      priority: dto.priority,
      createdBy: req.user?.userId, // Link to current user
    });
    
    res.status(201).json({ data: newTask });
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: UpdateTaskDTO = req.body;
    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user?.userId }, // Only update user's own tasks
      { ...dto },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.json({ data: updatedTask });
  } catch {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user?.userId, // Only delete user's own tasks
    });
    
    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
