"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Pie = dynamic(() => import("react-chartjs-2").then(m => m.Pie), { ssr: false });

export default function AdvancedAnalyticsPanel({ portfolio }) {
  const [metrics, setMetrics] = useState([]);
  const [sectorData, setSectorData] = useState({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });

  useEffect(() => {
    if (!portfolio || portfolio.length === 0) return;
    // Convert to symbols/allocation
    const symbols = portfolio.map(p => p.symbol);
    const allocation = {};
    portfolio.forEach(p => allocation[p.symbol] = p.shares);

    fetch("http://localhost:8000/analytics/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols, allocation })
    })
      .then(r => r.json())
      .then(({ metrics = {}, sector_breakdown = {} }) => {
        // Convert metrics object to array for .map()
        const metricsArr = Object.entries(metrics).map(([symbol, vals]) => ({
          symbol,
          ...vals,
        }));
        setMetrics(metricsArr);
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
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3 text-orange-700">Advanced Metrics</h3>
      <table className="w-full mb-4">
        <thead>
          <tr className="font-semibold"><th>Symbol</th><th>Beta</th><th>Alpha</th><th>Sharpe</th></tr>
        </thead>
        <tbody>
          {Array.isArray(metrics) && metrics.length === 0 ?
            <tr><td colSpan={4} className="text-center">No analytics yet.</td></tr> :
            metrics.map(m => (
              <tr key={m.symbol}>
                <td>{m.symbol}</td>
                <td>{m.beta?.toFixed(2) ?? "--"}</td>
                <td>{m.alpha?.toFixed(4) ?? "--"}</td>
                <td>{m.sharpe?.toFixed(2) ?? "--"}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="w-64 mx-auto">
        {sectorData.labels.length > 0 && <Pie data={sectorData} />}
      </div>
    </div>
  );
}
