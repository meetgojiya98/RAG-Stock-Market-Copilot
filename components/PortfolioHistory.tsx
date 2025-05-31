"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the Pie chart to avoid SSR issues with Chart.js
const Pie = dynamic(() => import("react-chartjs-2").then(m => m.Pie), { ssr: false });

type PortfolioItem = {
  symbol: string;
  shares: number;
};

interface PortfolioHistoryProps {
  portfolio: PortfolioItem[];
}

interface HistoryData {
  date: string;
  value: number;
}

export default function PortfolioHistory({ portfolio }: PortfolioHistoryProps) {
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [pieData, setPieData] = useState<any>(null);

  useEffect(() => {
    if (!portfolio.length) return;
    const symbols = portfolio.map(item => item.symbol);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify({ symbols }),
    })
      .then(res => res.json())
      .then((result) => {
        setHistory(result.history || []);
        // Optional: generate pie data for current portfolio allocation
        setPieData({
          labels: portfolio.map(item => item.symbol),
          datasets: [{
            data: portfolio.map(item => item.shares),
            backgroundColor: ["#fb923c", "#FFD700", "#FF6347", "#42A5F5", "#66BB6A"]
          }]
        });
      });
  }, [portfolio]);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Portfolio History</h3>
      {history.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No history data available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full mb-4 text-black dark:text-white">
            <thead>
              <tr className="font-semibold border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-1 text-left">Date</th>
                <th className="py-1 text-left">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.date} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-1">{h.date}</td>
                  <td className="py-1">${h.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pieData && pieData.labels.length > 0 && (
        <div className="w-64 mx-auto mt-4">
          <Pie data={pieData} />
        </div>
      )}
    </div>
  );
}
