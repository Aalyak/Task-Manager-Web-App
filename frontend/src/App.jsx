import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Splash from "./pages/splash";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ theme, toggleTheme }) {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard theme={theme} toggleTheme={toggleTheme} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function CursorGlow() {
  const fieldRef = useRef(null);
  const pos = useRef({ x: 50, y: 50, tx: 50, ty: 50 });

  useEffect(() => {
    const handleMove = (e) => {
      pos.current.tx = (e.clientX / window.innerWidth) * 100;
      pos.current.ty = (e.clientY / window.innerHeight) * 100;
    };
    window.addEventListener("mousemove", handleMove);

    let raf;
    const loop = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.12;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.12;
      if (fieldRef.current) {
        fieldRef.current.style.setProperty("--x", `${pos.current.x}%`);
        fieldRef.current.style.setProperty("--y", `${pos.current.y}%`);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="glow-field" ref={fieldRef} />;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          {theme === "dark" && <CursorGlow />}
          <AppRoutes theme={theme} toggleTheme={toggleTheme} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}