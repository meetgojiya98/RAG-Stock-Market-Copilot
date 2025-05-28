"use client";
import React, { useState, useEffect } from "react";
import StockPriceCard from "../components/StockPriceCard";
import Chart from "../components/Chart";
import NewsFeed from "../components/NewsFeed";
import AskAI from "../components/AskAI";

const PRESETS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    Promise.all([
      fetch(`http://localhost:8000/price/${symbol}`).then(r => r.json()),
      fetch(`http://localhost:8000/chart/${symbol}`).then(r => r.json()),
      fetch(`http://localhost:8000/news/${symbol}`).then(r => r.json())
    ]).then(([priceRes, chartRes, newsRes]) => {
      setPrice(priceRes.price);
      setChange(priceRes.change);
      setChartData(chartRes.data || []);
      setNews(newsRes.news || []);
    }).catch(() => setError("Could not fetch data. Please check your backend."));
  }, [symbol]);

  const askAI = async (question: string) => {
    setAiLoading(true);
    setAiAnswer("");
    try {
      const resp = await fetch("http://localhost:8000/ask", {
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
    <div className="min-h-screen bg-gradient-to-b from-orange-200 to-white">
      <div className="bg-orange-600 p-4 flex justify-between items-center">
        <span className="text-white font-bold text-xl">RAG Stock Copilot</span>
        <button className="bg-black text-white px-4 py-1 rounded">Sign in</button>
      </div>
      <div className="container mx-auto px-2 py-8">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="symbol" className="font-semibold">Stock Symbol:</label>
          <input
            value={symbol}
            onChange={e => setSymbol(e.target.value.toUpperCase())}
            className="border px-2 py-1 rounded"
            id="symbol"
            style={{ width: 80 }}
          />
          {PRESETS.map(sym => (
            <button key={sym}
              onClick={() => setSymbol(sym)}
              className={`px-2 py-1 border rounded ${sym === symbol ? "bg-orange-400 text-white font-bold" : "bg-white text-orange-700"}`}>{sym}</button>
          ))}
        </div>
        {error ? (
          <div className="text-red-600 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <StockPriceCard symbol={symbol} price={price} change={change} />
            <Chart data={chartData} />
            <NewsFeed news={news} />
            <AskAI askAI={askAI} aiAnswer={aiAnswer} loading={aiLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
