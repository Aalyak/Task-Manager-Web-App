# Task Manager — Backend

REST API for the Task Manager app, built with Express and MongoDB.

## Tech Stack

- **Node.js + Express** — REST API framework
- **MongoDB (Mongoose)** — database
- **JWT + bcrypt** — authentication
- **Groq (llama-3.1-8b-instant)** — free, fast LLM API for the AI Suggest feature

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `MONGODB_URI` — get a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - `JWT_SECRET` — any long random string
   - `GROQ_API_KEY` — get a free key at [console.groq.com](https://console.groq.com)

3. Run the server:
   ```
   npm start
   ```
   Server runs on `http://localhost:5000` by default.

## API Endpoints

| Method | Endpoint            | Description                          |
|--------|----------------------|---------------------------------------|
| POST   | /api/auth/signup      | Create a new account                  |
| POST   | /api/auth/login       | Log in, returns JWT                   |
| GET    | /api/tasks             | List tasks (supports `?status=` and `?priority=` filters) |
| POST   | /api/tasks             | Create a task                         |
| PUT    | /api/tasks/:id         | Update a task                         |
| DELETE | /api/tasks/:id         | Delete a task                         |
| PATCH  | /api/tasks/reorder     | Bulk update order/status (drag-and-drop) |
| POST   | /api/ai/suggest        | Get AI-generated description + priority for a task title |

All `/api/tasks` and `/api/ai` routes require an `Authorization: Bearer <token>` header.

## Notes

- The Groq API key is only ever used server-side — the frontend never sees it.
- Passwords are hashed with bcrypt before storage.
