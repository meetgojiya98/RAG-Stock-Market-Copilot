"use client";
import React, { useEffect, useState } from "react";
import StockPriceCard from "../components/StockPriceCard";
import Chart from "../components/Chart";
import NewsFeed from "../components/NewsFeed";
import AskAI from "../components/AskAI";

const DEFAULT_SYMBOL = "AAPL";

export default function StockPage() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch live price and change
  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    fetch(`/api/stocks/price?symbol=${symbol}`)
      .then(res => res.json())
      .then(json => {
        setPrice(json.price ?? null);
        setChange(json.change ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch price");
        setLoading(false);
      });
  }, [symbol]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white px-4 py-8">
      <div className="flex items-center mb-6">
        <span className="text-lg font-bold mr-2">Stock Symbol:</span>
        <input
          type="text"
          className="border border-gray-400 rounded px-2 py-1"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          style={{ width: "80px" }}
        />
      </div>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockPriceCard symbol={symbol} price={price} change={change} loading={loading} error={error} />
        <Chart symbol={symbol} />
        <NewsFeed symbol={symbol} />
        <AskAI symbol={symbol} />
      </div>
    </div>
  );
}
