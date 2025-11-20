import { Router, Request, Response } from 'express';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage (will be replaced with database later)
const tasks: Task[] = [
  {
    id: '1',
    title: 'Setup project',
    description: 'Initialize backend and frontend',
    status: 'done',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Create API routes',
    description: 'Build RESTful API endpoints',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/tasks - Get all tasks
router.get('/', (_req: Request, res: Response) => {
  res.json({ data: tasks });
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', (req: Request, res: Response): void => {
  const task = tasks.find((t) => t.id === req.params.id);
  
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  
  res.json({ data: task });
});

// POST /api/tasks - Create new task
router.post('/', (req: Request, res: Response): void => {
  const dto: CreateTaskDTO = req.body;
  
  if (!dto.title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  const newTask: Task = {
    id: uuidv4(),
    title: dto.title,
    description: dto.description,
    status: dto.status || 'todo',
    priority: dto.priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  
  res.status(201).json({ data: newTask });
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req: Request, res: Response): void => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
  
  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  
  const dto: UpdateTaskDTO = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...dto,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({ data: tasks[taskIndex] });
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req: Request, res: Response): void => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
  
  if (taskIndex === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  
  tasks.splice(taskIndex, 1);
  
  res.status(204).send();
});

export default router;
