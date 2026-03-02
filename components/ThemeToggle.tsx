"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <div className="w-4 h-4" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={16} className="text-neutral-600 dark:text-neutral-400" />
      ) : (
        <Moon size={16} className="text-neutral-600 dark:text-neutral-400" />
      )}
    </button>
  );
}