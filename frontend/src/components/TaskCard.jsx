const priorityColors = {
  Low: "#2fb872",
  Medium: "#f5a623",
  High: "#e5484d",
};

export default function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const color = priorityColors[task.priority];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="card task-card"
      style={{
        padding: 14,
        marginBottom: 10,
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        "--priority-color": color,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{task.title}</h3>
        <span
          className="priority-badge"
          style={{
            color: color,
            background: `${color}1a`,
          }}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={() => onEdit(task)} className="btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}