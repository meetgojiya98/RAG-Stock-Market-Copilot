"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function AdvancedAnalyticsPanel({ portfolio }) {
  const [metrics, setMetrics] = useState([]);
  const [sectorData, setSectorData] = useState(null);

  useEffect(() => {
    if (!portfolio.length) return;
    const symbols = portfolio.map(row => row.symbol);
    const allocation = {};
    portfolio.forEach(row => allocation[row.symbol] = row.shares);

    fetch("http://localhost:8000/analytics/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      body: JSON.stringify({ symbols, allocation }),
    })
      .then(r => r.json())
      .then(({ metrics, sector_breakdown }) => {
        setMetrics(Object.entries(metrics).map(([symbol, vals]) => ({ symbol, ...vals })));
        setSectorData({
          labels: Object.keys(sector_breakdown),
          datasets: [{
            data: Object.values(sector_breakdown),
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
            <th className="py-1">Symbol</th>
            <th className="py-1">Beta</th>
            <th className="py-1">Alpha</th>
            <th className="py-1">Sharpe</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length === 0 && (
            <tr>
              <td colSpan={4} className="text-gray-500 dark:text-gray-400 py-2">No analytics yet.</td>
            </tr>
          )}
          {metrics.map(m => (
            <tr key={m.symbol} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-1">{m.symbol}</td>
              <td className="py-1">{m.beta && m.beta.toFixed(2)}</td>
              <td className="py-1">{m.alpha && m.alpha.toFixed(4)}</td>
              <td className="py-1">{m.sharpe && m.sharpe.toFixed(2)}</td>
            </tr>
          ))}
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
