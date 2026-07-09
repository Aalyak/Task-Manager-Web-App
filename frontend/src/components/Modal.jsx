export default function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card modal-card"
        style={{ width: "100%", maxWidth: 480, padding: 24, maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: "1.15rem" }}>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}