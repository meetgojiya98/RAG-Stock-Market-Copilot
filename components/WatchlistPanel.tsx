"use client";
import { useState, useEffect } from "react";

// 1. Type for each item in watchlist/trending
type WatchlistItem = {
  symbol: string;
  // add other fields if you expect them!
};

type TrendingItem = {
  symbol: string;
  count: number;
};

export default function WatchlistPanel() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [symbol, setSymbol] = useState("");
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [trending, setTrending] = useState<TrendingItem[]>([]);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const wl = await res.json();
    setWatchlist(wl);

    // Fetch live prices
    for (const row of wl) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/price/${row.symbol}`)
        .then(r => r.json())
        .then(p => setPrices(prices => ({ ...prices, [row.symbol]: p.price })));
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  // Trending stocks
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/trending`).then(r => r.json()).then(setTrending);
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/watchlist`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    setSymbol("");
    fetchWatchlist();
  };  

  const handleRemove = async (sym: string) => {
    const token = localStorage.getItem("access_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/watchlist?symbol=${sym}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWatchlist();
  };   

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow text-black dark:text-white">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Watchlist</h3>
      <form onSubmit={handleAdd} className="flex gap-2 mb-2">
        <input
          className="border px-2 py-1 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol"
          required
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded">Add</button>
      </form>
      <ul className="mb-4">
        {watchlist.map(row => (
          <li key={row.symbol} className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 py-2">
            <span>
              {row.symbol}
              {prices[row.symbol] &&
                <span className="text-gray-500 dark:text-gray-400 ml-2">${prices[row.symbol].toFixed(2)}</span>
              }
            </span>
            <button onClick={() => handleRemove(row.symbol)} className="text-red-500 text-xs">Remove</button>
          </li>
        ))}
      </ul>
      <h4 className="text-orange-700 dark:text-orange-400 font-semibold mb-1 mt-4">Trending Stocks</h4>
      <ul>
        {trending.map((row, i) => (
          <li key={row.symbol} className="text-gray-700 dark:text-gray-300 text-sm">
            {i + 1}. {row.symbol} ({row.count} owners)
          </li>
        ))}
      </ul>
    </div>
  );
}
