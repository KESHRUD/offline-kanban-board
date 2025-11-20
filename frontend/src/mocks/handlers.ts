// ============================================================================
// MSW Handlers - Mock API Routes
// Simulates backend API for offline development and testing
// ============================================================================

import { http, HttpResponse } from 'msw';

// In-memory storage for mock data
let tasks = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Initialize frontend and backend with proper folder structure',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date('2024-11-01').toISOString(),
  },
  {
    id: '2',
    title: 'Implement drag and drop',
    description: 'Add @dnd-kit for smooth task movement between columns',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-11-10').toISOString(),
    updatedAt: new Date('2024-11-15').toISOString(),
  },
  {
    id: '3',
    title: 'Add offline support',
    description: 'Implement Service Worker and IndexedDB for offline functionality',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-11-15').toISOString(),
    updatedAt: new Date('2024-11-18').toISOString(),
  },
  {
    id: '4',
    title: 'Write E2E tests',
    description: 'Create Playwright tests for critical user flows',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-11-18').toISOString(),
    updatedAt: new Date('2024-11-18').toISOString(),
  },
];

let boards = [
  {
    id: '1',
    name: 'My Kanban Board',
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date('2024-11-01').toISOString(),
  },
];

export const handlers = [
  // ==========================================================================
  // Tasks API - Match full URL with localhost:3000
  // ==========================================================================

  // GET /api/tasks - Get all tasks
  http.get('http://localhost:3000/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    
    // Simulate error scenarios
    if (url.searchParams.get('error') === '500') {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
    
    if (url.searchParams.get('error') === 'timeout') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(HttpResponse.json({ data: tasks }));
        }, 5000);
      });
    }
    
    // Normal response
    return HttpResponse.json({ data: tasks });
  }),

  // GET /api/tasks/:id - Get task by ID
  http.get('http://localhost:3000/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = tasks.find((t) => t.id === id);
    
    if (!task) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ data: task });
  }),

  // POST /api/tasks - Create new task
  http.post('http://localhost:3000/api/tasks', async ({ request }) => {
    const body = await request.json() as any;
    
    // Validation
    if (!body?.title) {
      return HttpResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const newTask = {
      id: String(tasks.length + 1),
      title: body.title as string,
      description: (body.description as string) || '',
      status: (body.status as string) || 'todo',
      priority: (body.priority as string) || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    
    return HttpResponse.json(
      { data: newTask },
      { status: 201 }
    );
  }),

  // PUT /api/tasks/:id - Update task
  http.put('http://localhost:3000/api/tasks/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    
    const taskIndex = tasks.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...(body as object),
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json({ data: tasks[taskIndex] });
  }),

  // DELETE /api/tasks/:id - Delete task
  http.delete('http://localhost:3000/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const taskIndex = tasks.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    tasks.splice(taskIndex, 1);
    
    return HttpResponse.json(
      { success: true },
      { status: 204 }
    );
  }),

  // ==========================================================================
  // Boards API
  // ==========================================================================

  // GET /api/boards - Get all boards
  http.get('http://localhost:3000/api/boards', () => {
    return HttpResponse.json({ data: boards });
  }),

  // POST /api/boards - Create new board
  http.post('http://localhost:3000/api/boards', async ({ request }) => {
    const body = await request.json() as any;
    
    if (!body?.name) {
      return HttpResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const newBoard = {
      id: String(boards.length + 1),
      name: body.name as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    boards.push(newBoard);
    
    return HttpResponse.json(
      { data: newBoard },
      { status: 201 }
    );
  }),

  // ==========================================================================
  // Health Check
  // ==========================================================================

  http.get('http://localhost:3000/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      mock: true,
      timestamp: new Date().toISOString(),
    });
  }),
];

// Reset data (useful for tests)
export const resetMockData = () => {
  tasks = [
    {
      id: '1',
      title: 'Setup project structure',
      description: 'Initialize frontend and backend with proper folder structure',
      status: 'done',
      priority: 'high',
      createdAt: new Date('2024-11-01').toISOString(),
      updatedAt: new Date('2024-11-01').toISOString(),
    },
    {
      id: '2',
      title: 'Implement drag and drop',
      description: 'Add @dnd-kit for smooth task movement between columns',
      status: 'done',
      priority: 'high',
      createdAt: new Date('2024-11-10').toISOString(),
      updatedAt: new Date('2024-11-15').toISOString(),
    },
    {
      id: '3',
      title: 'Add offline support',
      description: 'Implement Service Worker and IndexedDB for offline functionality',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2024-11-15').toISOString(),
      updatedAt: new Date('2024-11-18').toISOString(),
    },
    {
      id: '4',
      title: 'Write E2E tests',
      description: 'Create Playwright tests for critical user flows',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date('2024-11-18').toISOString(),
      updatedAt: new Date('2024-11-18').toISOString(),
    },
  ];
  
  boards = [
    {
      id: '1',
      name: 'My Kanban Board',
      createdAt: new Date('2024-11-01').toISOString(),
      updatedAt: new Date('2024-11-01').toISOString(),
    },
  ];
};
