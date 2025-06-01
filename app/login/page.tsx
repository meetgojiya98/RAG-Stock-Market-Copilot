"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    });
    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem("access_token", data.access_token);
      router.replace("/");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2 text-orange-600 dark:text-orange-400">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-xl transition">Sign In</button>
        {error && <div className="text-red-600 dark:text-red-400 text-center">{error}</div>}
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-orange-600 hover:underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}
