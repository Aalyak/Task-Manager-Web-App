import { useState } from "react";
import TaskCard from "./TaskCard";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["S","M","T","W","T","F","S"];

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarView({ tasks, onEdit, onDelete, onDragStart, onDrop }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toISO(new Date()));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = toISO(new Date());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // group tasks by dueDate (YYYY-MM-DD)
  const tasksByDate = tasks.reduce((acc, t) => {
    if (!t.dueDate) return acc;
    const key = t.dueDate.slice(0, 10);
    (acc[key] = acc[key] || []).push(t);
    return acc;
  }, {});

  const selectedTasks = tasksByDate[selectedDate] || [];

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div className="card" style={{ padding: 16, flex: "0 0 320px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button type="button" onClick={prevMonth} className="icon-btn">‹</button>
          <span style={{ fontWeight: 700, color: "var(--text)" }}>{MONTHS[month]} {year}</span>
          <button type="button" onClick={nextMonth} className="icon-btn">›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {DAYS.map((d, i) => (
            <span key={i} style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {d}
            </span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const cellISO = toISO(new Date(year, month, d));
            const hasTasks = !!tasksByDate[cellISO]?.length;
            const isToday = cellISO === today;
            const isSelected = cellISO === selectedDate;

            return (
              <button
                type="button"
                key={i}
                onClick={() => setSelectedDate(cellISO)}
                style={{
                  aspectRatio: "1",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  fontSize: "0.82rem",
                  fontWeight: isToday ? 700 : 500,
                  color: isSelected ? "#fff" : isToday ? "var(--primary)" : "var(--text)",
                  background: isSelected ? "var(--primary)" : "transparent",
                }}
              >
                <span>{d}</span>
                {hasTasks && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: isSelected ? "#fff" : "var(--primary)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: "1 1 280px" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: 12, color: "var(--text)" }}>
          {new Date(selectedDate).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>

        {selectedTasks.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
            No tasks due this day.
          </p>
        )}

        {selectedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}