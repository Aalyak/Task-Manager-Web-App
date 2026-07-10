# Task Manager

A full-stack task management app with kanban-style status tracking, drag-and-drop, AI-assisted task creation, and dark mode — built as a take-home project.
---
## Live Links

- **Live app:** https://task-manager-web-app-three.vercel.app/
- **API (backend):** https://task-manager-web-app-n583.onrender.com
- **GitHub:** https://github.com/Aalyak/Task-Manager-Web-App

## Note on the Live Link

This app is hosted on Vercel's free tier, which uses a shared `*.vercel.app` subdomain. 
Chrome's Safe Browsing sometimes flags these shared subdomains as a false positive, 
unrelated to this app's actual code. I've reported this to Google for review.

If you see a warning when opening the live link, click **"Details" → "Visit this 
unsafe site"** to proceed — the app is safe. Alternatively, you can run the project 
locally using the setup steps above, or review the source code directly in this repo.

Note: the backend is on Render's free tier, which spins down when idle — the first 
request after inactivity can take 30–50 seconds to respond. This is expected behavior.

## Features

- Full CRUD for tasks — title, description, due date, priority (Low/Medium/High), status (To Do/In Progress/Done)
- Filter tasks by status or priority
- Drag-and-drop between status columns
- Dark mode toggle
- Login / Signup with JWT authentication
- **AI Suggest** — type a rough task title, get an AI-generated description + suggested priority, editable before saving
- Responsive UI — works on mobile and desktop
- Custom animated date picker for due dates

---

## Tech Stack

**Frontend**
- **React 19 + Vite** — fast dev experience, modern React features
- **React Router** — client-side routing (auth-protected routes)
- **Axios** — API calls
- Plain CSS with CSS variables — theming (light/dark) without pulling in a UI framework

**Backend**
- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — database, flexible schema for tasks/users
- **JWT + bcrypt** — authentication and password hashing
- **Groq (`llama-3.1-8b-instant`)** — free, fast LLM API for the AI Suggest feature

**Why these choices:** React + Express + MongoDB is a stack I could move quickly in without fighting the tools, which mattered given the take-home timeline. Groq was picked over OpenAI for the AI feature specifically because it's free and fast enough that the "AI Suggest" button doesn't feel laggy — response times matter for a feature that's meant to feel like a quick assist, not a long wait.

---

## Project Structure

```
taskmanager/
├── frontend/     — React + Vite app
├── backend/      — Express API
└── README.md     — you are here
```

Each folder has its own README with more detail — see [`frontend/README.md`](./frontend/README.md) and [`backend/README.md`](./backend/README.md).

---

## Running Locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- `JWT_SECRET` — any long random string
- `GROQ_API_KEY` — free key at [console.groq.com](https://console.groq.com)

```bash
npm start
```
Runs on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Set the API URL in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```
Runs on `http://localhost:5173` by default.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/tasks` | List tasks (supports `?status=` and `?priority=` filters) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/reorder` | Bulk update order/status (drag-and-drop) |
| POST | `/api/ai/suggest` | Get AI-generated description + priority for a task title |

All `/api/tasks` and `/api/ai` routes require an `Authorization: Bearer <token>` header. Full details in [`backend/README.md`](./backend/README.md).

---

## AI Tools & Resources Used

- **Groq API** (`llama-3.1-8b-instant`) — powers the AI Suggest feature. The API key is read via `process.env` on the backend only and is never exposed to the frontend or included in any client-side request.
- **Claude** — used throughout development for UI design iteration (theming, component styling, the custom date picker) and for debugging JSX/build errors.

---

## What I'd Improve With More Time

Right now the JWT is stored in `localStorage` on the frontend, which is the common and simplest approach but is technically vulnerable to XSS in a stricter security model. With more time, I'd move to httpOnly cookies set by the backend for token storage instead. I'd also add optimistic UI rollback with clearer error toasts (currently a failed drag-and-drop silently refetches), and write actual tests for the API routes rather than relying on manual testing.

---

## Notes

- Passwords are hashed with bcrypt before storage.
- The Groq API key never touches the frontend — all AI calls happen server-side.
