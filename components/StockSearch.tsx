import { useState } from "react";
import STOCKS from "./Stocklist.json"; // Array of { symbol, name }

// 1. Define a type for each stock item
type Stock = {
  symbol: string;
  name: string;
};

// 2. Type the props for the component
type StockSearchProps = {
  onSelect: (symbol: string) => void;
};

export default function StockSearch({ onSelect }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const filtered: Stock[] = query.length
    ? (STOCKS as Stock[]).filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  return (
    <div className="relative">
      <input
        className="border p-2 rounded dark:bg-zinc-800 dark:text-white w-64"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks…"
      />
      {filtered.length > 0 && (
        <div className="absolute left-0 right-0 bg-white dark:bg-zinc-900 rounded shadow z-10">
          {filtered.map((stock) => (
            <div
              key={stock.symbol}
              className="p-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950"
              onClick={() => {
                setQuery(stock.symbol);
                onSelect(stock.symbol);
              }}
            >
              <b>{stock.symbol}</b> <span className="text-xs text-gray-500">{stock.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
