import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Chart({ data = [], loading = false }) {
  if (loading)
    return (
      <div className="rounded-2xl shadow-xl p-8 h-56 flex items-center justify-center animate-pulse bg-white/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 border border-zinc-100 dark:border-zinc-800 backdrop-blur">
        <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>
    );
  if (!data.length)
    return (
      <div className="rounded-2xl shadow-xl p-8 h-56 flex items-center justify-center bg-white/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 border border-zinc-100 dark:border-zinc-800 backdrop-blur">
        <span className="text-zinc-400">No chart data.</span>
      </div>
    );
  return (
    <div className="rounded-2xl shadow-xl p-8 h-56 bg-white/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 border border-zinc-100 dark:border-zinc-800 backdrop-blur">
      <Line
        data={{
          labels: data.map((d) => d.date),
          datasets: [{
            label: "Close Price",
            data: data.map((d) => d.close),
            fill: false,
            borderColor: "#ff9100",
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 2,
          }]
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        }}
      />
    </div>
  );
}
