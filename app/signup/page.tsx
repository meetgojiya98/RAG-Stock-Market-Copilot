"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    {
    e.preventDefault();
    setError("");
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    if (resp.ok) {
      router.push("/login");
    } else {
      const data = await resp.json();
      setError(data.detail || "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-2 text-orange-600 dark:text-orange-400">
          Sign Up
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-xl transition"
        >
          Sign Up
        </button>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center">{error}</div>
        )}
        <div className="text-center mt-2 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}
