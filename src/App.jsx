// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Theme } from "@carbon/react";
import HeaderBar from "./components/HeaderBar.jsx";
import Home from "./pages/Home.jsx";
import TryItOut from "./pages/TryItOut.jsx";
import Snippets from "./pages/Snippets.jsx";

export default function App() {
  // Default to DARK, persisted
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "g90");
  const toggleTheme = () => setTheme((t) => (t === "g90" ? "g10" : "g90"));

  // Apply to <html> so Monaco + raw elements follow along
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    root.classList.remove("cds-theme-g10", "cds-theme-g90");
    root.classList.add(theme === "g90" ? "cds-theme-g90" : "cds-theme-g10");
    root.style.colorScheme = theme === "g90" ? "dark" : "light";
  }, [theme]);

  return (
    <Theme theme={theme}>
      <HeaderBar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/try" element={<TryItOut />} />
        <Route path="/snippets" element={<Snippets />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Theme>
  );
}