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
        background:
          "linear-gradient(160deg, #000000 0%, #120000 45%, #2b0000 100%)",
        transform: stage === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      {/* Floating Red Glow */}
      <div className="splash-blob splash-blob-1" />
      <div className="splash-blob splash-blob-2" />
      <div className="splash-blob splash-blob-3" />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: 20,
        }}
      >
        {stage === "loading" && (
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <span
              className="splash-dot"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="splash-dot"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="splash-dot"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        )}

        {(stage === "heading" ||
          stage === "tagline" ||
          stage === "exit") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div className="splash-logo">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 2.5V6M16 2.5V6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M7 11.5L10 14.5L17 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
        /* Loading Dots */
        .splash-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e50914, #ff4d4d);
          animation: splashPulse 1s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(229,9,20,0.7);
        }

        @keyframes splashPulse {
          0%,100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Logo */
        .splash-logo {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg,#b20710,#e50914);
          color: white;
          box-shadow:
            0 0 20px rgba(229,9,20,.6),
            0 0 45px rgba(229,9,20,.4);
          animation: splashPop .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        .splash-logo svg{
          width:32px;
          height:32px;
        }

        @keyframes splashPop{
          0%{
            transform:scale(.3);
            opacity:0;
          }
          100%{
            transform:scale(1);
            opacity:1;
          }
        }

        /* Heading */
        .splash-heading{
          margin-top:16px;
          font-size:2.3rem;
          font-weight:800;
          letter-spacing:-1px;
          background:linear-gradient(135deg,#ffffff,#ff5c5c);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
          animation:splashFadeUp .7s ease both;
        }

        /* Tagline */
        .splash-tagline{
          margin-top:10px;
          max-width:360px;
          font-size:1rem;
          color:#d5d5d5;
          line-height:1.6;
          animation:splashFadeUp .8s ease both;
        }

        @keyframes splashFadeUp{
          from{
            opacity:0;
            transform:translateY(15px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        /* Floating Glow */
        .splash-blob{
          position:absolute;
          border-radius:50%;
          filter:blur(70px);
          opacity:.35;
          animation:splashFloat 9s ease-in-out infinite;
        }

        .splash-blob-1{
          width:340px;
          height:340px;
          background:#e50914;
          top:-90px;
          left:-70px;
        }

        .splash-blob-2{
          width:280px;
          height:280px;
          background:#8b0000;
          bottom:-80px;
          right:-50px;
          animation-delay:2s;
        }

        .splash-blob-3{
          width:220px;
          height:220px;
          background:#ff3b3b;
          top:45%;
          left:60%;
          animation-delay:4s;
        }

        @keyframes splashFloat{
          0%,100%{
            transform:translate(0,0) scale(1);
          }
          50%{
            transform:translate(30px,-30px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}