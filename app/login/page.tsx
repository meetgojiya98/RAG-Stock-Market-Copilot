"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!resp.ok) {
        setError("Invalid email or password.");
        return;
      }
      const data = await resp.json();
      // Store JWT for portfolio
      localStorage.setItem("access_token", data.access_token);
      router.push("/portfolio");
    } catch {
      setError("Failed to login.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400">Sign In</h1>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <input
          className="border p-2 rounded-lg dark:bg-zinc-800 dark:text-white"
          placeholder="Email"
          value={email}
          type="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded-lg dark:bg-zinc-800 dark:text-white"
          placeholder="Password"
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700">Login</button>
        <p className="text-sm text-center mt-2 text-gray-500 dark:text-gray-400">
          Use <b>demo@example.com</b> / <b>password123</b>
        </p>
      </form>
    </div>
  );
}
