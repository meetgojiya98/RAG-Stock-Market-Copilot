"use client";
import { useState, useEffect } from "react";

export default function PortfolioTable({ onPortfolioChange }: { onPortfolioChange?: (p: any[]) => void }) {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<{ [k: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Fetch portfolio
  const fetchPortfolio = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPortfolio(data || []);
    if (onPortfolioChange) onPortfolioChange(data || []);

    // Fetch real prices
    for (const row of data || []) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/price/${row.symbol}`)
        .then(r => r.json())
        .then(p => setPrices(prices => ({ ...prices, [row.symbol]: p.price })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ symbol, shares: Number(shares) })
    });
    if (res.ok) {
      setSymbol(""); setShares(""); fetchPortfolio();
    } else {
      const data = await res.json();
      setError(data.detail || "Add failed.");
    }
  };

  const handleRemove = async (sym: string) => {
    const token = localStorage.getItem("access_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio?symbol=${sym}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPortfolio();
  };

  // Calculate total value
  const totalValue = (portfolio || []).reduce((sum, row) =>
    sum + (prices[row.symbol] || 0) * row.shares, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input className="border px-2 py-1 rounded bg-white dark:bg-zinc-800 text-black dark:text-white" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol (e.g. AAPL)" required />
        <input className="border px-2 py-1 rounded bg-white dark:bg-zinc-800 text-black dark:text-white" value={shares} onChange={e => setShares(e.target.value)} placeholder="Shares" type="number" required />
        <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded">Add</button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full text-left text-black dark:text-white">
        <thead>
          <tr className="font-semibold"><th>Symbol</th><th>Shares</th><th>Price</th><th>Value</th><th>Action</th></tr>
        </thead>
        <tbody>
          {(portfolio || []).map(row => (
            <tr key={row.symbol}>
              <td>{row.symbol}</td>
              <td>{row.shares}</td>
              <td>${prices[row.symbol]?.toFixed(2) ?? "--"}</td>
              <td>${prices[row.symbol] ? (prices[row.symbol] * row.shares).toFixed(2) : "--"}</td>
              <td><button onClick={() => handleRemove(row.symbol)} className="text-red-500">Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-lg font-semibold mt-2 text-orange-700 dark:text-orange-400">
        Total Portfolio Value: <span>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      </div>
      {loading && <div className="text-gray-400 dark:text-gray-500">Loading portfolio...</div>}
    </div>
  );
}
