import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["S","M","T","W","T","F","S"];
const YEAR_PAGE = 12;

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("days"); // "days" | "years"
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const [yearPageStart, setYearPageStart] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  useEffect(() => {
    function handleClick(e) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popupRef.current && !popupRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    function reposition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 260;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < 340;
      let left = rect.left;
      if (left + popupWidth > window.innerWidth - 8) {
        left = window.innerWidth - popupWidth - 8;
      }
      setCoords({
        top: openUpward ? rect.top - 8 : rect.bottom + 8,
        left,
        openUpward,
      });
    }
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  function openPicker() {
    setViewMode("days");
    setYearPageStart(Math.floor(year / YEAR_PAGE) * YEAR_PAGE);
    setOpen((o) => !o);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selected = value ? new Date(value) : null;
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(d) {
    const picked = new Date(year, month, d);
    onChange(toISO(picked));
    setOpen(false);
  }

  function selectYear(y) {
    setViewDate(new Date(y, month, 1));
    setViewMode("days");
  }

  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  const yearCells = [];
  for (let i = 0; i < YEAR_PAGE; i++) yearCells.push(yearPageStart + i);

  return (
    <div className="datepicker">
      <button type="button" ref={triggerRef} className="datepicker-trigger" onClick={openPicker}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M8 3V7M16 3V7M3.5 10H20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
        <span>{value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Pick a date"}</span>
      </button>

      {open && createPortal(
        <div
          ref={popupRef}
          className="datepicker-popup"
          style={{
            position: "fixed",
            top: coords.openUpward ? "auto" : coords.top,
            bottom: coords.openUpward ? window.innerHeight - coords.top : "auto",
            left: coords.left,
          }}
        >
          {viewMode === "days" ? (
            <>
              <div className="datepicker-header">
                <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))}>‹</button>
                <button type="button" className="datepicker-title" onClick={() => setViewMode("years")}>
                  {MONTHS[month]} {year}
                </button>
                <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))}>›</button>
              </div>
              <div className="datepicker-grid datepicker-daynames">
                {DAYS.map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className="datepicker-grid">
                {cells.map((d, i) => {
                  if (!d) return <span key={i} />;
                  const cellDate = new Date(year, month, d);
                  const isSelected = isSameDay(cellDate, selected);
                  const isToday = isSameDay(cellDate, today);
                  return (
                    <button
                      type="button"
                      key={i}
                      className={`datepicker-day${isSelected ? " selected" : ""}${isToday ? " today" : ""}`}
                      onClick={() => selectDay(d)}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="datepicker-header">
                <button type="button" onClick={() => setYearPageStart((y) => y - YEAR_PAGE)}>‹</button>
                <span>{yearPageStart} – {yearPageStart + YEAR_PAGE - 1}</span>
                <button type="button" onClick={() => setYearPageStart((y) => y + YEAR_PAGE)}>›</button>
              </div>
              <div className="datepicker-year-grid">
                {yearCells.map((y) => (
                  <button
                    type="button"
                    key={y}
                    className={`datepicker-year${y === year ? " selected" : ""}`}
                    onClick={() => selectYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}