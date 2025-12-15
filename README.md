<div align="center">

# 🚀 Galilée OS - Offline Kanban Board

**Progressive Web Application for Sup Galilée Engineering Students**

[![CI/CD Pipeline](https://github.com/yourusername/offline-kanban-board/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/offline-kanban-board/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](https://www.docker.com/)

</div>

---

## 📖 Overview

Galilée OS is a **full-stack Progressive Web Application** designed for engineering students at **Sup Galilée (Sorbonne Paris Nord)**. It combines project management, AI-powered flashcard generation, and gamification to enhance academic productivity.

<div align="center">

### 🛠️ Tech Stack

| Frontend | Backend | Database | DevOps |
|:--------:|:-------:|:--------:|:------:|
| ![React](https://img.shields.io/badge/-React_19-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/-Node.js_20-339933?style=flat-square&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript_5.8-3178C6?style=flat-square&logo=typescript&logoColor=white) | ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | ![IndexedDB](https://img.shields.io/badge/-IndexedDB-FF6F00?style=flat-square&logo=firebase&logoColor=white) | ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | | ![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=nginx&logoColor=white) |
| ![Vite](https://img.shields.io/badge/-Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white) | ![Gemini AI](https://img.shields.io/badge/-Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white) | | ![Netlify](https://img.shields.io/badge/-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white) |

</div>

---

## ✨ Features

### 🎯 **Core Features**
- **📋 Kanban Board** - Drag & drop task management with columns
- **🧠 AI Flashcards** - Generate revision cards using Gemini 2.5 API
- **🎮 Gamification** - XP system, levels, ranks, and daily goals
- **⏱️ Focus Timer** - Pomodoro technique with ambient sounds
- **🎨 Dual Theme** - Professional & Sci-Fi "Galilée" themes

### 🔒 **PWA Capabilities**
- ✅ **Offline First** - Works without internet using IndexedDB
- ✅ **Installable** - Add to home screen on mobile/desktop
- ✅ **Service Worker** - Caches assets for instant loading
- ✅ **Background Sync** - Syncs data when back online

### 🧪 **Quality Assurance**
- **26 Unit Tests** (Vitest)
- **85 E2E Tests** (Playwright - Chrome, Firefox, WebKit, Mobile)
- **100% TP Requirements** covered

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker & Docker Compose (optional)

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/offline-kanban-board.git
cd offline-kanban-board

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 🔧 Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories:

**frontend/.env**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:3001/api
```

**backend/.env**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/galilee
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### ▶️ Running Locally

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

Open http://localhost:5173 in your browser.

### 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the app
# Frontend: http://localhost:80
# Backend:  http://localhost:3001
```

---

## 📁 Project Structure

```
offline-kanban-board/
├── frontend/                 # React + Vite PWA
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API, storage, auth
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities & translations
│   ├── tests/e2e/           # Playwright E2E tests
│   └── public/              # Static assets & SW
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── middleware/      # Auth, error handling
│   └── tests/               # Backend unit tests
├── docker/                   # Dockerfiles
└── .github/workflows/        # CI/CD pipelines
```

---

## 🧪 Testing

```bash
# Frontend unit tests
cd frontend && npm run test

# Frontend E2E tests
cd frontend && npm run test:e2e

# Backend tests
cd backend && npm run test
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create user account |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/boards` | Get user's boards |
| `POST` | `/api/boards` | Create new board |
| `PUT` | `/api/boards/:id` | Update board |
| `DELETE` | `/api/boards/:id` | Delete board |

---

## 🤖 Gemini AI Configuration

To enable AI features (flashcard generation, task enhancement):

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add `VITE_GEMINI_API_KEY=your_key` to `frontend/.env`
3. For production (Netlify/Vercel), add as environment variable

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Sup Galilée Engineering Students** - PWA Development Course 2024-2025
- University: **Sorbonne Paris Nord**

---

<div align="center">

**Made with ❤️ for Sup Galilée**

![Sup Galilée](https://img.shields.io/badge/Sup_Galilée-Sorbonne_Paris_Nord-0055A4?style=for-the-badge)

</div>