"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from "chart.js";

// Register Chart.js components
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const RANGE_LABELS = [
  { label: "1M", value: "1M" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" },
  { label: "5Y", value: "5Y" },
  { label: "Max", value: "max" }
];

export default function StockChartCard({ symbol = "AAPL" }) {
  const [range, setRange] = useState("1M");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/history/${symbol}?range=${range}`);
      const data = await res.json();
      // Assume data: [{ date: "2024-05-01", price: 199.95 }, ...]
      setChartData({
        labels: data.map(d => d.date),
        datasets: [{
          label: `${symbol} Price`,
          data: data.map(d => d.price),
          borderColor: "#fb923c",
          backgroundColor: "rgba(251,146,60,0.1)",
          fill: true,
          pointRadius: 1,
          tension: 0.4,
        }]
      });
      setLoading(false);
    }
    fetchData();
  }, [symbol, range]);

  return (
    <div className="bg-zinc-800 dark:bg-zinc-800 p-4 rounded-xl shadow w-full h-full flex flex-col">
      <div className="flex gap-2 mb-2">
        {RANGE_LABELS.map(r =>
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              range === r.value
                ? "bg-orange-500 text-white"
                : "bg-zinc-700 text-zinc-200 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {r.label}
          </button>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center min-h-[180px]">
        {loading || !chartData ? (
          <span className="text-gray-400">Loading chart...</span>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  callbacks: {
                    label: ctx => `$${ctx.parsed.y.toFixed(2)}`
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: "#d1d5db",
                    maxTicksLimit: 6,
                  },
                  grid: { color: "rgba(255,255,255,0.05)" }
                },
                y: {
                  ticks: {
                    color: "#d1d5db"
                  },
                  grid: { color: "rgba(255,255,255,0.08)" }
                }
              },
              elements: {
                line: { borderWidth: 2 },
                point: { radius: 2 }
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
