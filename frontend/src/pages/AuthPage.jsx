import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Force dark theme on auth page, restore previous theme on leave
  useEffect(() => {
    const previousTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      document.documentElement.setAttribute("data-theme", previousTheme || "light");
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
          <div className="logo-mark" style={{ width: 44, height: 44, borderRadius: 12 }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 2.5V6M16 2.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M7 11.5L10 14.5L17 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "1.55rem", marginBottom: 4, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {mode === "login" ? "Log in to manage your tasks" : "Sign up to get started"}
            </p>
          </div>
        </div>

        {mode === "signup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aalya Krishnan"
              required
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              style={{ width: "100%", paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 4,
                display: "flex",
              }}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M10.6 6.2C11 6.1 11.5 6 12 6c6.5 0 10 7 10 7s-1 2-2.9 3.7M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <p style={{ fontSize: "0.85rem", textAlign: "center", color: "var(--text-muted)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          
            href<a
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </a>
        </p>
      </form>
    </div>
  );
}