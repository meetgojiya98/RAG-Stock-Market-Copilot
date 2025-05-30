// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import StockPriceCard from "../components/StockPriceCard";
import Chart from "../components/Chart";
import NewsFeed from "../components/NewsFeed";
import AskAI from "../components/AskAI";
import SearchBar from "../components/SearchBar";
import sp500 from "./data/sp500.json"; // adjust path if needed

const PRESETS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/price/${symbol}`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/chart/${symbol}`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/news/${symbol}`).then(r => r.json())
    ]).then(([priceRes, chartRes, newsRes]) => {
      setPrice(priceRes.price);
      setChange(priceRes.change);
      setChartData(chartRes.data || []);
      setNews(newsRes.news || []);
      setLoading(false);
    }).catch(() => {
      setError("Could not fetch data. Please check your backend.");
      setLoading(false);
    });
  }, [symbol]);

  const askAI = async (question: string) => {
    setAiLoading(true);
    setAiAnswer("");
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question, symbol }),
      });
      const data = await resp.json();
      setAiAnswer(data.answer || "No answer.");
    } catch {
      setAiAnswer("Could not fetch answer from backend.");
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white dark:from-zinc-900 dark:to-black transition-colors">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <SearchBar stocks={sp500} onSelect={setSymbol} />
          <label htmlFor="symbol" className="font-semibold dark:text-white">Quick presets:</label>
          {PRESETS.map(sym => (
            <button key={sym}
              onClick={() => setSymbol(sym)}
              className={`px-3 py-1 border rounded transition 
                ${sym === symbol ? "bg-orange-400 dark:bg-orange-600 text-white font-bold" : "bg-white dark:bg-zinc-800 text-orange-700 dark:text-orange-300"}`}>{sym}</button>
          ))}
        </div>
        {error ? (
          <div className="text-red-600 dark:text-red-400 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StockPriceCard symbol={symbol} price={price} change={change} loading={loading} />
            <Chart symbol={symbol} data={chartData} loading={loading} />
            <NewsFeed news={news} loading={loading} />
            <AskAI askAI={askAI} aiAnswer={aiAnswer} loading={aiLoading} />
          </div>
        )}
      </div>
    </div>
  );
}