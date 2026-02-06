"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("front_theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("front_theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--line)] bg-[color:var(--panel)] px-4 py-2 text-xs tracking-[0.12em] text-[var(--muted)] uppercase hover:border-[var(--accent)] hover:text-[var(--text)]"
      aria-label="Basculer le mode clair et sombre"
    >
      Theme
    </button>
  );
}
