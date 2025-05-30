"use client";
import { useState, useEffect } from "react";

export default function WatchlistPanel() {
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [prices, setPrices] = useState({});
  const [trending, setTrending] = useState([]);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:8000/watchlist", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const wl = await res.json();
    setWatchlist(wl);

    // Fetch live prices
    for (const row of wl) {
      fetch(`http://localhost:8000/price/${row.symbol}`)
        .then(r => r.json())
        .then(p => setPrices(prices => ({ ...prices, [row.symbol]: p.price })));
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  // Trending stocks
  useEffect(() => {
    fetch("http://localhost:8000/trending").then(r => r.json()).then(setTrending);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch("http://localhost:8000/watchlist", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    setSymbol("");
    fetchWatchlist();
  };

  const handleRemove = async (sym) => {
    const token = localStorage.getItem("access_token");
    await fetch(`http://localhost:8000/watchlist?symbol=${sym}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWatchlist();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3 text-orange-700">Watchlist</h3>
      <form onSubmit={handleAdd} className="flex gap-2 mb-2">
        <input
          className="border px-2 py-1 rounded"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol"
          required
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded">Add</button>
      </form>
      <ul className="mb-4">
        {watchlist.map(row => (
          <li key={row.symbol} className="flex justify-between items-center border-b py-2">
            <span>{row.symbol} {prices[row.symbol] && (<span className="text-gray-500 ml-2">${prices[row.symbol].toFixed(2)}</span>)}</span>
            <button onClick={() => handleRemove(row.symbol)} className="text-red-500 text-xs">Remove</button>
          </li>
        ))}
      </ul>
      <h4 className="text-orange-700 font-semibold mb-1 mt-4">Trending Stocks</h4>
      <ul>
        {trending.map((row, i) => (
          <li key={row.symbol} className="text-gray-700 text-sm">{i + 1}. {row.symbol} ({row.count} owners)</li>
        ))}
      </ul>
    </div>
  );
}
