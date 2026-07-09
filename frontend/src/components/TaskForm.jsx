import { useState } from "react";
import client from "../api/client";
import DatePicker from "./DatePicker";

const emptyTask = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "To Do",
};

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const [task, setTask] = useState(initialTask || emptyTask);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setTask((t) => ({ ...t, [field]: value }));
  }

  async function handleAiSuggest() {
    if (!task.title.trim()) {
      setAiError("Type a task title first, then hit AI Suggest.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    try {
      const { data } = await client.post("/ai/suggest", { title: task.title });
      setTask((t) => ({ ...t, description: data.description, priority: data.priority }));
    } catch (err) {
      setAiError(err.response?.data?.message || "AI suggestion failed. You can fill this in manually.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!task.title.trim()) return;
    setSaving(true);
    try {
      await onSave(task);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Title</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={task.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. fix login bug"
            required
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="btn-secondary"
            style={{ whiteSpace: "nowrap" }}
          >
            {aiLoading ? "Thinking…" : "✨ AI Suggest"}
          </button>
        </div>
        {aiError && <div style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{aiError}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Description</label>
        <textarea
          value={task.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What needs to be done?"
          rows={3}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Due Date</label>
          <DatePicker
            value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
            onChange={(val) => update("dueDate", val)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Priority</label>
          <select value={task.priority} onChange={(e) => update("priority", e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Status</label>
          <select value={task.status} onChange={(e) => update("status", e.target.value)}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save Task"}
        </button>
      </div>
    </form>
  );
}
