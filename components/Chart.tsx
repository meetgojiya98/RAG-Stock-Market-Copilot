// components/Chart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Chart({ data = [] }: { data: { date: string, close: number }[] }) {
  if (!data.length) return (
    <div className="bg-white rounded shadow p-4 h-60 flex items-center justify-center">No chart data.</div>
  );
  return (
    <div className="bg-white rounded shadow p-4 h-60">
      <Line
        data={{
          labels: data.map((d) => d.date),
          datasets: [
            {
              label: "Close Price",
              data: data.map((d) => d.close),
              fill: false,
              borderColor: "rgba(255,99,132,1)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: true } },
        }}
      />
    </div>
  );
}
