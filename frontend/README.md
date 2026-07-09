# 📋 Task Manager — Frontend Client

The user interface for the Task Manager application, built with **React 19** and **Vite**. It provides an intuitive, fluid Kanban-style workspace for organizing and managing daily tasks, styled with pure CSS.

---

## 🚀 Key Client Features

*   **Interactive Task Board** — Complete CRUD operations managed visually across custom column swimlanes.
*   **Drag-and-Drop Reordering** — Dynamically shuffle task priorities or transition statuses instantly.
*   **Real-time Filtering** — Quick-toggle layout filters to slice tasks by completion status or individual priority rankings.
*   **AI-Assisted Task Creation** — Integrated helper module that sends a quick title prompt to the backend to auto-populate description templates and priority evaluations before saving.
*   **Custom Customizations** — Includes a customized, animated date picker for tracking due dates and a responsive layout that scales down to mobile screens.
*   **Theming Options** — Built-in native dark mode toggle using CSS global layout variables.

---

## 🛠️ Frontend Tech Stack

*   **React 19** — Component rendering framework.
*   **Vite** — High-speed application bundler and local asset hosting server.
*   **React Router** — Client-side route mapping and explicit authentication wall barriers.
*   **Axios** — Centralized base HTTP orchestrator for handling REST API endpoints.
*   **Context API (`AuthContext`)** — Dedicated global state slice tracking active user tokens and session mappings.

---

## 📂 Directory Layout

```text
frontend/
├── src/
│   ├── api/            # Centralized Axios instance configuration
│   ├── components/     # Modals, TaskCards, Swimlanes, and custom DatePickers
│   ├── context/        # Global AuthContext provider state setup
│   ├── pages/          # Main route components (Dashboard layout & Auth login views)
│   ├── App.jsx         # Component structure mapping and router barriers
│   └── main.jsx        # App mounting entry point
├── .env.example        # Environment deployment structural layout
└── README.md           # This file!