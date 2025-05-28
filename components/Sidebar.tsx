"use client";
import Link from "next/link";
export default function Sidebar() {
  return (
    <aside className="bg-saffron text-black w-56 p-4 flex flex-col gap-6 font-bold shadow-xl min-h-screen">
      <div className="text-2xl font-extrabold text-white mb-6">Stocks 🚀</div>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="hover:text-skyblue">Dashboard</Link>
        <Link href="/portfolio" className="hover:text-skyblue">Portfolio</Link>
        <Link href="/analytics" className="hover:text-skyblue">Analytics</Link>
      </nav>
    </aside>
  );
}
