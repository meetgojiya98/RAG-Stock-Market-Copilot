"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Portfolio() {
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const user = session?.user?.email || "guest";

  async function fetchPortfolio() {
    const res = await fetch(`http://localhost:8000/portfolio/${user}`);
    const data = await res.json();
    setPortfolio(data.portfolio);
  }

  async function addStock() {
    await fetch("http://localhost:8000/portfolio/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, symbol, shares: Number(shares) }),
    });
    setSymbol("");
    setShares("");
    fetchPortfolio();
  }

  async function removeStock(s: string) {
    await fetch("http://localhost:8000/portfolio/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, symbol: s }),
    });
    fetchPortfolio();
  }

  useEffect(() => {
    if (user) fetchPortfolio();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded shadow border-navy border">
      <h3 className="font-bold text-navy mb-2">Portfolio</h3>
      <div className="flex gap-2 mb-2">
        <input
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol"
          className="border p-1 rounded w-24"
        />
        <input
          value={shares}
          type="number"
          onChange={e => setShares(e.target.value)}
          placeholder="Shares"
          className="border p-1 rounded w-24"
        />
        <button onClick={addStock} className="bg-saffron text-white px-2 py-1 rounded">Add</button>
      </div>
      <ul>
        {portfolio.map((item, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>{item.symbol}: {item.shares} shares</span>
            <button onClick={() => removeStock(item.symbol)} className="text-red-500 px-2">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
