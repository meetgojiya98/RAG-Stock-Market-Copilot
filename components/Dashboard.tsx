"use client";
import StockChart from "./StockChart";
import NewsFeed from "./NewsFeed";
import Portfolio from "./Portfolio";
import Analytics from "./Analytics";
import AskAI from "./AskAI";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 mt-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <StockChart symbol="AAPL" />
          <Analytics />
        </div>
        <div>
          <Portfolio />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NewsFeed />
        <AskAI />
      </div>
    </div>
  );
}
