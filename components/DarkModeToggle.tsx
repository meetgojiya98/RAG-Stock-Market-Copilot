"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-full bg-white/10 hover:bg-saffron/30 transition">
      {dark ? <Sun className="text-saffron" /> : <Moon className="text-saffron" />}
    </button>
  );
}
