"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun, LogOut, User } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio", protected: true },
  { name: "Notifications", href: "/notifications", protected: true },
  { name: "Watchlist", href: "/watchlist", protected: true },
  { name: "Analytics", href: "/analytics" },
  { name: "Research", href: "/research" },
];

export default function Header() {
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Theme handling
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDark(theme === "dark");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Login state on route change and storage events
  useEffect(() => {
    const checkLogin = () => setLoggedIn(!!localStorage.getItem("access_token"));
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, [pathname]);

  // Navigation handler for protected links
  const handleNav = (href: string, isProtected: boolean) => {
    if (isProtected && !localStorage.getItem("access_token")) {
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-8 py-4 backdrop-blur bg-white/80 dark:bg-zinc-950/90 shadow-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div
        className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fb923c] via-[#ff9100] to-[#fbe7b6] dark:from-[#ffe082] dark:via-[#ff9100] dark:to-[#fb923c] select-none cursor-pointer"
        onClick={() => router.push("/")}
      >
        Stock Market Copilot
      </div>
      <nav className="flex gap-1 md:gap-4 items-center">
        {NAV_LINKS.map(link => (
          <button
            key={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition 
              ${pathname === link.href
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow"
                : "text-zinc-700 hover:text-orange-600 dark:text-zinc-200 dark:hover:text-orange-400"}`}
            onClick={() => handleNav(link.href, !!link.protected)}
          >
            {link.name}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-4">
        <button
          className="rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-400 hover:text-white dark:hover:bg-orange-400 dark:hover:text-zinc-900 p-2 transition"
          aria-label="Toggle dark mode"
          onClick={() => setDark(d => !d)}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {!loggedIn && (
          <>
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold shadow hover:opacity-90 transition"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-orange-500 text-orange-600 font-bold hover:bg-orange-50 transition"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
        {loggedIn && (
          <>
            <button
              className="flex items-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-orange-700 dark:text-orange-300 font-medium hover:bg-orange-50 dark:hover:bg-orange-900 transition"
              onClick={() => router.push("/profile")}
            >
              <User className="mr-1" size={18} /> Profile
            </button>
            <button
              className="flex items-center px-3 py-2 rounded-lg bg-red-50 dark:bg-zinc-900 text-red-600 font-bold hover:bg-red-200 dark:hover:bg-red-950 transition"
              onClick={handleLogout}
            >
              <LogOut className="mr-1" size={18} /> Logout
            </button>
          </>
        )}
      </div>
      <style jsx global>{`
        body {
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
      `}</style>
    </header>
  );
}
