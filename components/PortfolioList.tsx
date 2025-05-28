"use client";
import { useEffect, useState } from "react";

export default function PortfolioList() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => setPortfolio(data));
  }, []);
  return (
    <div className="bg-white text-black rounded p-4 shadow">
      <h2 className="font-bold text-saffron mb-4">Your Holdings</h2>
      <ul>
        {portfolio.map((p, i) => (
          <li key={i} className="border-b border-gray-200 py-2">
            {p.name}:
            <ul>
              {p.stocks.map((s: any) => (
                <li key={s.symbol}>
                  {s.symbol} — {s.shares} shares
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
