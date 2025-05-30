"use client";
import { useEffect, useState } from "react";

export default function Portfolio({ symbol, onSelect }) {
  const [portfolio, setPortfolio] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("portfolio");
    setPortfolio(data ? JSON.parse(data) : []);
  }, []);

  const addStock = (sym: string) => {
    if (!portfolio.includes(sym)) {
      const updated = [...portfolio, sym];
      setPortfolio(updated);
      localStorage.setItem("portfolio", JSON.stringify(updated));
    }
  };

  const removeStock = (sym: string) => {
    const updated = portfolio.filter(s => s !== sym);
    setPortfolio(updated);
    localStorage.setItem("portfolio", JSON.stringify(updated));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow mb-6">
      <div className="flex items-center mb-2">
        <span className="font-bold">My Portfolio</span>
        <button className="ml-auto bg-orange-500 text-white px-2 py-1 rounded"
          onClick={() => addStock(symbol)}>
          + Add {symbol}
        </button>
      </div>
      {portfolio.length === 0 ? (
        <div className="text-gray-500">No stocks added yet.</div>
      ) : (
        <ul>
          {portfolio.map(sym => (
            <li key={sym} className="flex items-center py-1">
              <span
                className="cursor-pointer font-mono"
                onClick={() => onSelect(sym)}
              >{sym}</span>
              <button
                className="ml-2 text-xs text-red-500"
                onClick={() => removeStock(sym)}
              >Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
