import { http, HttpResponse, delay } from "msw";
import type { Task, Column } from "../types";

// In-memory database for MSW
let tasks: Task[] = [
  {
    id: "t-1",
    title: "Setup project structure",
    description: "Initialize the Kanban PWA with Vite and React",
    columnId: "todo",
    tags: ["setup", "frontend"],
    priority: "high",
    createdAt: Date.now() - 86400000,
    subtasks: [],
    comments: [],
  },
  {
    id: "t-2",
    title: "Implement drag and drop",
    description: "Add HTML5 drag and drop functionality",
    columnId: "in-progress",
    tags: ["feature", "ux"],
    priority: "medium",
    createdAt: Date.now() - 43200000,
    subtasks: [],
    comments: [],
  },
  {
    id: "t-3",
    title: "Configure Service Worker",
    description: "Setup PWA offline capabilities",
    columnId: "done",
    tags: ["pwa", "offline"],
    priority: "high",
    createdAt: Date.now() - 172800000,
    subtasks: [],
    comments: [],
  },
];

let columns: Column[] = [
  { id: "todo", title: "To Do", order: 0 },
  { id: "in-progress", title: "In Progress", order: 1 },
  { id: "done", title: "Done", order: 2 },
];

export const handlers = [
  // === TASKS ===

  // GET /api/tasks
  http.get("/api/tasks", async ({ request }) => {
    const url = new URL(request.url);

    // Simulate errors for testing
    if (url.searchParams.get("error") === "500") {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }
    if (url.searchParams.get("slow") === "1") {
      await delay(2000);
    }

    return HttpResponse.json(tasks);
  }),

  // POST /api/tasks
  http.post("/api/tasks", async ({ request }) => {
    const newTask = (await request.json()) as Partial<Task>;
    const task: Task = {
      id: `t-${Date.now()}`,
      title: newTask.title || "New Task",
      description: newTask.description || "",
      columnId: newTask.columnId || "todo",
      tags: newTask.tags || [],
      priority: newTask.priority || "medium",
      createdAt: Date.now(),
      subtasks: newTask.subtasks || [],
      comments: newTask.comments || [],
      dueDate: newTask.dueDate,
      diagramCode: newTask.diagramCode,
    };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  // PATCH /api/tasks/:id
  http.patch("/api/tasks/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Task>;
    const index = tasks.findIndex((t) => t.id === id);

    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      return HttpResponse.json(tasks[index]);
    }
    return HttpResponse.json({ error: "Task not found" }, { status: 404 });
  }),

  // DELETE /api/tasks/:id
  http.delete("/api/tasks/:id", ({ params }) => {
    const { id } = params;
    tasks = tasks.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  // === COLUMNS ===

  // GET /api/columns
  http.get("/api/columns", () => {
    return HttpResponse.json(columns);
  }),

  // POST /api/columns
  http.post("/api/columns", async ({ request }) => {
    const newColumn = (await request.json()) as Partial<Column>;
    const column: Column = {
      id: `col-${Date.now()}`,
      title: newColumn.title || "New Column",
      order: columns.length,
    };
    columns.push(column);
    return HttpResponse.json(column, { status: 201 });
  }),

  // DELETE /api/columns/:id
  http.delete("/api/columns/:id", ({ params }) => {
    const { id } = params;
    columns = columns.filter((c) => c.id !== id);
    // Also remove tasks in this column
    tasks = tasks.filter((t) => t.columnId !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  // === SYNC (for offline) ===

  // POST /api/sync
  http.post("/api/sync", async ({ request }) => {
    const { pendingTasks } = (await request.json()) as { pendingTasks: Task[] };

    for (const task of pendingTasks) {
      const existingIndex = tasks.findIndex((t) => t.id === task.id);
      if (existingIndex !== -1) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
    }

    return HttpResponse.json({ synced: pendingTasks.length, tasks });
  }),
];
