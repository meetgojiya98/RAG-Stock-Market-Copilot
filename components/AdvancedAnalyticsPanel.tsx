"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

type PortfolioItem = {
  symbol: string;
  shares: number;
};

interface AdvancedAnalyticsPanelProps {
  portfolio: PortfolioItem[];
}

type Metric = {
  symbol: string;
  beta?: number;
  alpha?: number;
  sharpe?: number;
  [key: string]: any;
};

type SectorData = {
  labels: string[];
  datasets: { data: number[]; backgroundColor: string[] }[];
} | null;

export default function AdvancedAnalyticsPanel({ portfolio }: AdvancedAnalyticsPanelProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [sectorData, setSectorData] = useState<SectorData>(null);

  useEffect(() => {
    if (!portfolio.length) return;
    const symbols = portfolio.map(row => row.symbol);
    const allocation: Record<string, number> = {};
    portfolio.forEach(row => allocation[row.symbol] = row.shares);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/analytics/advanced`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}` 
      },
      body: JSON.stringify({ symbols, allocation }),
    })
      .then(r => r.json())
      .then(({ metrics, sector_breakdown }) => {
        setMetrics(
          Object.entries(metrics || {}).map(([symbol, vals]: [string, any]) => ({
            symbol,
            ...vals,
          }))
        );
        setSectorData({
          labels: Object.keys(sector_breakdown || {}),
          datasets: [{
            data: Object.values(sector_breakdown || {}),
            backgroundColor: ["#fb923c", "#FFD700", "#FF6347", "#42A5F5", "#66BB6A"]
          }]
        });
      });
  }, [portfolio]);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Advanced Metrics</h3>
      <table className="w-full mb-4 text-black dark:text-white">
        <thead>
          <tr className="font-semibold border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-1 text-left">Symbol</th>
            <th className="py-1 text-left">Beta</th>
            <th className="py-1 text-left">Alpha</th>
            <th className="py-1 text-left">Sharpe</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-gray-500 dark:text-gray-400 py-2">No analytics yet.</td>
            </tr>
          ) : (
            metrics.map(m => (
              <tr key={m.symbol} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-1">{m.symbol}</td>
                <td className="py-1">{typeof m.beta === "number" ? m.beta.toFixed(2) : "--"}</td>
                <td className="py-1">{typeof m.alpha === "number" ? m.alpha.toFixed(4) : "--"}</td>
                <td className="py-1">{typeof m.sharpe === "number" ? m.sharpe.toFixed(2) : "--"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="w-64 mx-auto">
        {sectorData && sectorData.labels.length > 0 && (
          <Pie data={sectorData} />
        )}
      </div>
    </div>
  );
}
