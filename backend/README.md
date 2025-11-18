# Backend - Offline Kanban Board

RESTful API for the Offline Kanban Board PWA.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create new board

### Health Check
- `GET /health` - Server health status

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── types/           # TypeScript types
│   ├── controllers/     # Route controllers
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Environment Variables

See `.env.example` for all available environment variables.

## 📚 Tech Stack

- Node.js + TypeScript
- Express.js
- Helmet (security)
- CORS
- Zod (validation)
- Vitest (testing)
