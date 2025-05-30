"use client";
import { useEffect, useState } from "react";
export default function TrendingStocks() {
  const [trending, setTrending] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/trending`)
      .then(r => r.json())
      .then(setTrending);
  }, []);
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="font-bold text-lg text-orange-700 mb-2">Trending Stocks</h3>
      <ul>
        {trending.map(t => (
          <li key={t.symbol} className="mb-1">
            <span className="font-mono">{t.symbol}</span>{" "}
            <span className="text-gray-500">({t.count} users)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
