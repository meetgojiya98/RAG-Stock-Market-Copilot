// components/StockPriceCard.tsx
import React from "react";
export default function StockPriceCard({ symbol, price, change }: { symbol: string, price: number | null, change: number | null }) {
  const color = change == null ? "text-black" : change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-800";
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col h-32">
      <span className="font-semibold mb-2">{symbol} Stock Price</span>
      <span className="text-3xl font-mono mb-1">{price !== null ? `$${price.toFixed(2)}` : "--"}</span>
      <span className={`font-bold ${color}`}>{change !== null ? `${change > 0 ? "+" : ""}${change.toFixed(2)}` : ""}</span>
    </div>
  );
}
