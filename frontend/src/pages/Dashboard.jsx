import { useState, useEffect, useCallback } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Modal from "../components/Modal";
import CalendarView from "../components/CalendarView";

const STATUSES = ["To Do", "In Progress", "Done"];

export default function Dashboard({ theme, toggleTheme }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [view, setView] = useState("board"); // "board" | "calendar"

  const { user, logout } = useAuth();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const { data } = await client.get("/tasks", { params });
      setTasks(data);
    } catch (err) {
      setError("Couldn't load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleSave(taskData) {
    if (editingTask) {
      await client.put(`/tasks/${editingTask._id}`, taskData);
    } else {
      await client.post("/tasks", taskData);
    }
    setModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    await client.delete(`/tasks/${id}`);
    fetchTasks();
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function handleDragStart(e, task) {
    setDraggedTask(task);
  }

  async function handleDrop(e, newStatus) {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) return;
    const updated = { ...draggedTask, status: newStatus };
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    try {
      await client.put(`/tasks/${draggedTask._id}`, { status: newStatus });
    } catch {
      fetchTasks(); // revert on failure
    }
    setDraggedTask(null);
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "16px 0",
          background: "var(--surface)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 10, letterSpacing: "-0.01em" }}>
  <span className="logo-mark">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 2.5V6M16 2.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 11.5L10 14.5L17 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
  Task Manager
</h1>
<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
    Hi, {user?.name?.split(" ")[0]}
  </span>
  <button onClick={toggleTheme} className="icon-btn" title="Toggle theme">
    {theme === "dark" ? (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 2.5V5M12 19V21.5M4.2 4.2L6 6M18 18L19.8 19.8M2.5 12H5M19 12H21.5M4.2 19.8L6 18M18 6L19.8 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )}
  </button>
  <button onClick={logout} className="icon-btn" title="Log out">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </button>
</div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div className="filter-bar" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setView(view === "board" ? "calendar" : "board")}
              className="btn-secondary"
            >
              {view === "board" ? "📅 Calendar View" : "📋 Board View"}
            </button>
            <button onClick={openCreate} className="btn-primary">
              + New Task
            </button>
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>}

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading tasks…</p>
        ) : view === "calendar" ? (
          <CalendarView
            tasks={tasks}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDragStart={handleDragStart}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {STATUSES.map((status) => {
              const columnTasks = tasks.filter((t) => t.status === status);
              const isDragOver = dragOverStatus === status;
              return (
                <div
                  key={status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverStatus(status);
                  }}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDrop={(e) => {
                    handleDrop(e, status);
                    setDragOverStatus(null);
                  }}
                  className="kanban-column"
                  style={{
                    background: isDragOver ? "var(--surface-hover)" : "var(--bg)",
                    outline: isDragOver ? "2px dashed var(--primary)" : "2px dashed transparent",
                  }}
                >
                  <div className="kanban-column-header">
                    <span>{status}</span>
                    <span className="kanban-count">{columnTasks.length}</span>
                  </div>
                  {columnTasks.length === 0 && (
                    <p className="kanban-empty">No tasks here</p>
                  )}
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalOpen && (
        <Modal title={editingTask ? "Edit Task" : "New Task"} onClose={() => setModalOpen(false)}>
          <TaskForm
            initialTask={editingTask}
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}