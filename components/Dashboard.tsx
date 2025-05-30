'use client';
import React, { useContext } from "react";
import { ThemeContext } from "../app/layout";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { dark, toggle } = useContext(ThemeContext);
  return (
    <button
      className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-orange-400 dark:hover:bg-orange-600 transition"
      onClick={toggle}
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="text-yellow-400" /> : <Moon className="text-zinc-700" />}
    </button>
  );
}
