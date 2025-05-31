// components/ThemeContext.tsx

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Optional: Remember theme on reload (localStorage)
  const [theme, setTheme] = useState<Theme>(
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme) || "light"
      : "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Optional: Add/remove dark class on <html>
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
