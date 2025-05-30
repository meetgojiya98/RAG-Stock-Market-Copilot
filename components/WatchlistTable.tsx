"use client";
import { useEffect, useState } from "react";

export default function WatchlistTable() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");

  async function fetchWatchlist() {
    const token = localStorage.getItem("access_token");
    const resp = await fetch("http://localhost:8000/watchlist", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWatchlist(await resp.json());
  }

  useEffect(() => { fetchWatchlist(); }, []);

  async function addStock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("access_token");
    const resp = await fetch("http://localhost:8000/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symbol }),
    });
    if (!resp.ok) setError("Failed to add to watchlist");
    setSymbol("");
    fetchWatchlist();
  }

  async function removeStock(sym: string) {
    const token = localStorage.getItem("access_token");
    await fetch(`http://localhost:8000/watchlist?symbol=${sym}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWatchlist();
  }

  return (
    <div>
      <form onSubmit={addStock} className="flex gap-2 mb-6">
        <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol" className="border rounded px-3 py-2" required />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-orange-100 dark:bg-zinc-800">
            <th className="py-2 px-3">Symbol</th>
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map(row => (
            <tr key={row.symbol}>
              <td className="py-2 px-3">{row.symbol}</td>
              <td className="py-2 px-3">
                <button onClick={() => removeStock(row.symbol)} className="text-red-600 hover:underline">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
