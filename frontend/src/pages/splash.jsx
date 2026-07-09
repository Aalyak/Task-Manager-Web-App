import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [stage, setStage] = useState("loading"); // loading -> heading -> tagline -> exit

  useEffect(() => {
    const t1 = setTimeout(() => setStage("heading"), 700);
    const t2 = setTimeout(() => setStage("tagline"), 1600);
    const t3 = setTimeout(() => setStage("exit"), 3000);
    const t4 = setTimeout(() => onFinish(), 3600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0a0a12 0%, #14101f 50%, #0a0a12 100%)",
        transform: stage === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      {/* floating gradient blobs */}
      <div className="splash-blob splash-blob-1" />
      <div className="splash-blob splash-blob-2" />
      <div className="splash-blob splash-blob-3" />

      <div style={{ position: "relative", textAlign: "center", padding: 20 }}>
        {stage === "loading" && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <span className="splash-dot" style={{ animationDelay: "0s" }} />
            <span className="splash-dot" style={{ animationDelay: "0.15s" }} />
            <span className="splash-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        )}

        {(stage === "heading" || stage === "tagline" || stage === "exit") && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="splash-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M8 2.5V6M16 2.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M7 11.5L10 14.5L17 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="splash-heading">Task Manager</h1>

            {(stage === "tagline" || stage === "exit") && (
              <p className="splash-tagline">
                Every completed task brings you one step closer to your dreams.
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        .splash-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c6cf6, #f5a3ff);
          animation: splashPulse 1s ease-in-out infinite;
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1); opacity: 1; }
        }

        .splash-logo {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7c6cf6, #f5a3ff);
          color: #fff;
          animation: splashPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .splash-logo svg { width: 30px; height: 30px; }
        @keyframes splashPop {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .splash-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 14px;
          background: linear-gradient(135deg, #fff, #c9c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: splashFadeUp 0.6s ease both;
        }

        .splash-tagline {
          font-size: 0.95rem;
          color: #a9a5c4;
          max-width: 320px;
          margin-top: 8px;
          animation: splashFadeUp 0.6s ease both;
        }

        @keyframes splashFadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .splash-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          animation: splashFloat 8s ease-in-out infinite;
        }
        .splash-blob-1 {
          width: 320px; height: 320px;
          background: #7c6cf6;
          top: -80px; left: -60px;
        }
        .splash-blob-2 {
          width: 260px; height: 260px;
          background: #f5a3ff;
          bottom: -60px; right: -40px;
          animation-delay: 2s;
        }
        .splash-blob-3 {
          width: 200px; height: 200px;
          background: #4dd0e1;
          top: 40%; left: 60%;
          animation-delay: 4s;
        }
        @keyframes splashFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}